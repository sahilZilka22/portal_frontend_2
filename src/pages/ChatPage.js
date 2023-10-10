import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useHistory } from "react-router-dom"; // Import useHistory for navigation
import { useToast } from "@chakra-ui/react"; // Import the toast library

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const history = useHistory(); // Initialize useHistory
  const toast = useToast(); // Initialize toast

  useEffect(() => {
    // Check if the user exists, and handle redirection and error toast
    if (!user) {
      const localUser = JSON.parse(localStorage.getItem("userInfo"));
      if (localUser && localUser.status === 404) {
        // Show an error toast
        toast({
          title: "User not found",
          description: "Please log in or sign up",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        // Close the ChatPage component
        window.close();

        // Reload the home page (adjust the path as needed)
        window.location.href = "/"; // You can use window.location.pathname as well
      }
    }
  }, [user, toast]);

  // Render the ChatPage component when the user exists
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
