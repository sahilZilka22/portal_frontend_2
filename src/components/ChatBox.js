import React from 'react'
import { Box } from "@chakra-ui/layout";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from './Miscellaneous/SingleChat';
import NewSingleChat from './Miscellaneous/NewSingleChat';

const ChatBox = ({ fetchAgain,setFetchAgain }) => {
    const { selectedChat } = ChatState();
 
  return (
    <Box
    display={{base : selectedChat ? "flex"  : "none", md: "flex"}}
    alignItems="center"
    flexDirection="column"
    p={3}
    bg="white"
    w={{base : "100%",md : "68%"}}
    borderRadius="1g"
    borderWidth="1px"
    >
      <NewSingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox