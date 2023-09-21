import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from '../UserComponents/UserBadgeItem';
import UserListItem from '../UserComponents/UserListItem ';

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
     const { isOpen, onOpen, onClose } = useDisclosure()
     const [groupChatName, setGroupChatName] = useState();
     const [search, setSearch] = useState("");
     const [searchResult, setSearchResult] = useState([]);
     const { user, selectedChat, setSelectedChat } = ChatState();
     const [loading, setLoading] = useState(false);
     const [renameLoading, setRenameLoading] = useState(false);
     const toast = useToast();
     const api = axios.create({
      baseURL: 'https://backend-p1wy.onrender.com/api/v1', // Replace with your backend URL
    });

     const handleAddUser =async(user1) => {
        if(selectedChat.users.find((u)=> u._id === user1._id)){
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
          return
        }
        if(selectedChat.groupAdmin._id !== user._id){
             toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
          return;
        }
        try {
            setLoading(true);
            const config = {
                headers : {
                     Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await api.put(`/chat/groupadd`,
                {
                    chatId : selectedChat._id,
                    userId : user1._id
                },
            config 
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setLoading(false);
        } catch (error) {
              toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
            }
            setGroupChatName("");
       };

     const handleSearch = async(query) => {
        setLoading(true);
        setSearch(query);
        if(!query){
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers : {
                     Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await api.get(`/user/searchUsers?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
             toast({
                 title: "Error Occured!",
                 description: "Failed to Load the Search Results",
                 status: "error",
                 duration: 5000,
                 isClosable: true,
                 position: "bottom-left",
            });
           }
     }

    const handleRemove = async(user1)=>{
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
                toast({
                    title: "Only admins can remove someone!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            return;
    }
        try {
            setLoading(true);
            const config = {
                headers : {
                    Authorization :  `Bearer ${user.token}`,
                }
            };
            const { data } = await api.put(`/chat/groupremove`,
                {
                chatId: selectedChat._id,
                userId: user1._id,
                },
                config
            );
            console.log(data);
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false); 
        } catch (error) {
            console.log(error);
            console.log(`Error response : ${error.response}`);
            toast({
                    title: "Error Occured!",
                    description: error.response.data,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
             setLoading(false);
        }
        setGroupChatName("");
    }
    const handleRename = async() => {
        if(!groupChatName) return
        try {
            setRenameLoading(true);
            const config = {
                headers : {
                         Authorization: `Bearer ${user.token}`,
                }
            }
            const {data} = await api.put(
                `/chat/rename`,
                {chatId:selectedChat._id,chatName : groupChatName},
                config
            );
            console.log(data._id);
            setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
            setRenameLoading(false);   
        }
        setGroupChatName("");
    }


  return (
    <>
    <IconButton display={{base : "flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
                <Input
                placeholder = "Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                
                />
                <Button variant="solid"
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input
                placeholder='Add user to group'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}/>
                {
                    loading ? (
                        <Spinner size="1g" />
                    ) : (
                        searchResult?.map((u)=>( 
                            <UserListItem
                            key={u._id}
                            user={u}
                            handleFunction={()=>handleAddUser(u)}
                            />
                        ))
                    )
                }
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=> handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal