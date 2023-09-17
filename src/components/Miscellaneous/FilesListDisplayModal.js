import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  Box,
  List,
  IconButton,
  ListItem,
  ListIcon
} from "@chakra-ui/react";
import {AttachmentIcon, DeleteIcon} from "@chakra-ui/icons"
import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5001"  ;
var socket;

const FilesListDisplayModal = ({children}) => {
     const [files,setfiles] =  useState([]);
     const [sendingFiles, setsendingFiles] = useState(false)
     const { isOpen, onOpen, onClose } = useDisclosure();
     const toast = useToast();
     const {selectedChat,user} = ChatState();
     socket = io(ENDPOINT);

     
     /*  
     we will take inspiration from signup box single file upload 
     1) Show modal to select files from and then show the list of files below that
     2) once selected files show the selected file names in modal
     and then we can also send a text message as well
     */
    // we are using useEffect hook to automatically close the modal after 5secs
   
        
  useEffect(() => {
    // Use useEffect to automatically close the modal after 5 seconds
    if (!sendingFiles && !isOpen) {
         setfiles([]); // Clear the files state
      }
    }, [sendingFiles, isOpen]);
    
    
    const handleFileSelection = (eventFiles) =>{
        if(eventFiles === undefined){
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
    
  const removefile = (index) =>{
       const allfiles = [...files]
       allfiles.splice(index,1);
       setfiles(allfiles);
    }

  const sendFiles = async() =>{
    if(files.length == 0){
         toast({
            title : "Could not send the Files",
            status : "error",
            duration : 3000,
            isClosable : true,
            position : "bottom"
        });
        return;
    }
    try {
        setsendingFiles(true);
        const formdata = new FormData();
        const config = {
            headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          }
        }
        formdata.append("chatId",selectedChat._id);
        files.forEach((file)=>{
            formdata.append("content",file)
        })
        const {data} = await axios.post("/api/v1/newMessage", formdata, config);
        // setNewMessage to data
        socket.emit("new message",data);
        
        toast({
            title : "Files Sent",
            status : "success",
            duration : 3000,
            isClosable : true,
            position : "bottom"
        })

        setfiles([]);
    } catch (error) {
       console.log(error);
       toast({
            title : "Could not send the Files",
            status : "error",
            duration : 3000,
            isClosable : true,
            position : "bottom"
        });
    }finally{
        setsendingFiles(false);
        setfiles([]);
    }
  }

 

  return (
    <>
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
        <ModalContent>
            <ModalHeader>Selected Files</ModalHeader>
                <ModalCloseButton />
                    <ModalBody>
                        {files.length > 0 ? (
                            // Content to render when `files` array has elements
                            // You can put your content here
                            <div>
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
                                            {file.name}
                                            <IconButton
                                                icon={<DeleteIcon/>}
                                                onClick={() => removefile(index)}
                                                color="white"
                                                bgColor="red.400"
                                                />
                                           </Box>
                                        </ListItem>
                                        ))}
                                </List>
                            </div>
                        ) : (
                            // Content to render when `files` array is empty
                            // You can put your content here
                            <p>No files available.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <label htmlFor="file-input">
                            <IconButton
                            icon={<AttachmentIcon/>}
                            as="span"
                            aria-label='Attach files'
                            size="md"
                            marginRight="25px"
                            />
                            <input
                            type="file"
                            id='file-input'
                            style={{display : "none"}}
                            multiple
                            onChange={handleFileSelection}
                             />
                        </label>
                    <Button colorScheme="blue" mr={3} onClick={sendFiles}>
                        {sendingFiles ? "Sending files..." : "Send Files"}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
             </ModalFooter>
         </ModalContent>
     </Modal>
    </>
  )
}

export default FilesListDisplayModal