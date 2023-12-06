import React from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text} from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Divider } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "../components/Miscellaneous/ChatlLoading";
import GroupChatModal from "../components/Miscellaneous/GroupChatModal";
import { getSender } from '../config/chatLogics';


const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const backend = "https://dooper-backend.onrender.com/api/v1";
  const localbackend = "http://localhost:5001/api/v1";

  const api = axios.create({
    baseURL: backend, // Replace with your backend URL
  });

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.get("/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      padding={3}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "18px", md: "24px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            backgroundColor="#E6013F"
            textColor={"white"}
            maxH={26}
            fontSize={{ base: "12px", md: "10px", lg: "16px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#FFEFF4"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat, index) => (
              <React.Fragment key={chat._id}>
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#E6013F" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroupChat
                      ? chat.users[0] && chat.users[1]
                        ? getSender(loggedUser, chat.users)
                        : "User not found"
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      {/* Add your message display logic here */}
                    </Text>
                  )}
                </Box>
                {index < chats.length - 1 && ( // Add Divider only if it's not the last item
                  <Divider mt={2} mb={2} />
                )}
              </React.Fragment>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats