import React, { useEffect } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, FormControl, 
  IconButton, Input, InputGroup,
  InputRightElement,
  Spinner, Text,useColorModeValue,
  useToast,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  ListIcon,
   } from '@chakra-ui/react'
import { ArrowBackIcon,DeleteIcon,ArrowForwardIcon,AddIcon,AttachmentIcon, DownloadIcon} from '@chakra-ui/icons'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import { getSender, getSenderFull } from '../../config/chatLogics'
import ProfileModal from './ProfileModal'
import { useState } from 'react'
import axios from 'axios'
import ScrollableChat from '../ScrollableChat'
import "./styles.css";
import io from "socket.io-client";
import AudioRecorder from '../Miscellaneous/AudioRecorder'


const ENDPOINT = "http://localhost:5001"  ; // backend endpoint
var socket, selectedChatCompare;

const NewSingleChat = ({fetchAgain,setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [files,setfiles] =  useState([]);
    const [sendingFiles, setsendingFiles] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();   
    const backend = 'https://backend-p1wy.onrender.com/api/v1'
    const localbackend = "http://localhost:5001/api/v1"
    const api = axios.create({
      baseURL: backend, // Replace with your backend URL
    });

    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();

    useEffect(()=>{
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on("connected",()=> setSocketConnected(true));
      socket.on("typing",()=>setIsTyping(true));
      socket.on("stop typing",()=>setIsTyping(false));

    },[]);

    const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await api.get(
        `/newMessage/getallMessages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      setIsTyping(false)
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
     }
    };


 
   const handleFileSelection = (eventFiles) =>{
        if(eventFiles.target.files.length === undefined){
            toast ({
                title : "Please select files to send",
                status : "warning",
                duration : 5000,
                isClosable : true,
                position : "bottom"
            });
        }
        
        const filesArray = Array.from(eventFiles.target.files);
        setfiles(filesArray);   
    }
    
  const removeFile = (index) =>{
       const allfiles = [...content]
       allfiles.splice(index,1);
       setfiles(allfiles)
    }

    // make a function which will recieve the file from the audio recorder
    // and set it to setfiles(audioFile)
    const handleAudioRecorded = (recordedAudioFile) => {
       const event = {
        key: "Enter", // Set the desired key or event properties
        type: "click", // Set the desired event type
      };
      console.log("Call the new Message function");
      sendNewMessage(event,recordedAudioFile);
    }
 
 
  // chatId,message = newMessage, content = Array of files
  const sendNewMessage = async (event,recordedAudioFile) => {
    setsendingFiles(true)
    const formData = new FormData();
  if ((event.key === "Enter" || event.type === "click") && 
      (newMessage || files.length > 0 || recordedAudioFile)){;
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      if(recordedAudioFile){
        formData.append("content",recordedAudioFile)
        console.log("File sent from here");
      }else{
          files.forEach((file) => {
            formData.append("content", file);
          });
      }
      
      formData.append("chatId", selectedChat._id);

      if (newMessage) {
        formData.append('message', newMessage);
      }
      const { data } = await api.post("/newMessage", formData, config);
      socket.emit("new message", data);
      setMessages([...messages, data]);
      setNewMessage(""); // Clear the message input field
      setfiles([]); // Clear the content (files)
      setsendingFiles(false)
    } catch (error) {
      if (error.response) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }else{
         toast({
           title: "Error Occured from the servers!",
           description: error.response.data.message,
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
      }
    }
  }
  };


  const typingHandler = (e) => {
    
    setNewMessage(e.target.value)
    if(!socketConnected) return ;
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id);
    }

    var lastTypingTime = new Date().getTime();
    var timerLength = 2500;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      // if the user is typing and stopped after 2.5 secs it will emit stop typing event
      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false)
        setIsTyping(false)
      }
    },timerLength);

  }

   useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat
    },[selectedChat]);

    useEffect(()=>{
      socket.on("message recieved", (newMessageRecieved)=>{
        if(!selectedChatCompare ||
           selectedChatCompare._id !== newMessageRecieved.chat._id ){
            if(!notification.includes(newMessageRecieved)){
              setNotification([newMessageRecieved,...notification])
              setFetchAgain(!fetchAgain);
            }
           }else{
            setMessages([...messages,newMessageRecieved])
           }
      })
    });

    const paleGreenColor = useColorModeValue("green.500", "green.200");


return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendNewMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  {"typing..."}
                </div>
              ) : (
                <></>
              )}
             <InputGroup> 
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement>
                  <Button 
                  marginRight="150px" 
                  onClick={onOpen} 
                  colorScheme='blue' 
                  size="md"
                  px={2}
                  minWidth="auto" // Adjust the width as neede
                  >
                    Send Files
                  </Button>
                </InputRightElement>
                <InputRightElement width="auto">
                  <IconButton 
                   aria-label="Send Message"
                   icon={<ArrowForwardIcon/>}
                   onClick={sendNewMessage}
                   bgColor={paleGreenColor}
                   _hover={{bgColor : paleGreenColor}}
                   size="md"
                   marginRight="2px" 
                  />
                </InputRightElement>
                <InputRightElement marginRight={150} >
                  {messages && <> <AudioRecorder onAudioRecorded={handleAudioRecorded}/> </>}
                </InputRightElement>
                {/* conditional rendering is when setcontent.length is true so do what is after && */}
             </InputGroup>
               {/* Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Selected Files</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <label htmlFor="file-input">
                        <IconButton
                          icon={<AddIcon />}
                          as="span"
                          aria-label="Attach Files"
                          size="lg"
                          marginBottom="10px"
                        />
                        <input
                          type="file"
                          id="file-input"
                          style={{ display: 'none' }}
                          multiple
                          onChange={handleFileSelection}
                        />
                      </label>
                      {files.length > 0 ? (
                        <List spacing={3}>
                          {files.map((file, index) => (
                            <ListItem key={index}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                bg="palegreen"
                                p={2}
                                borderRadius="md"
                              >
                                <ListIcon as={AttachmentIcon} color="green.500" />
                                {file.name}
                                <IconButton
                                  icon={<DeleteIcon />}
                                  onClick={() => removeFile(index)}
                                  color="white"
                                  bgColor="red.400"
                                />
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <p>No files selected.</p>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={sendNewMessage}
                        isDisabled={files.length === 0}
                      >
                        {sendingFiles ? "Sending files" : "Send Files"}
                      </Button>
                      <Button variant="ghost" onClick={onClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );

}

export default NewSingleChat