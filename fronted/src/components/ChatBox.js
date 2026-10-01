import React from "react";

import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "64%" }}
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      Single Chat
    </Box>
  );
};

export default ChatBox;
