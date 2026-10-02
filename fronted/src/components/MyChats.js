
import React, { useEffect } from "react";
import axios from "axios";

import { AddIcon } from "@chakra-ui/icons";

import {
  Box,
  Button,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();

  // =========================
  // FETCH CHATS
  // =========================
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.token) {
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          "/api/chat",
          config
        );

        setChats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch Chats Error:", error);

        toast({
          title: "Error Occurred!",
          description:
            error?.response?.data?.message ||
            "Failed to load chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    fetchChats();
  }, [fetchAgain, user, setChats, toast]);

  // =========================
  // GET CHAT NAME
  // =========================
  const getChatName = (chat) => {
    if (!chat) {
      return "Chat";
    }

    // Group chat
    if (chat.isGroupChat) {
      return chat.chatName || "Group Chat";
    }

    // One-to-one chat
    const otherUser = chat.users?.find(
      (chatUser) => chatUser._id !== user?._id
    );

    return otherUser?.name || "Chat";
  };

  // =========================
  // GET CHAT INFO
  // =========================
  const getChatInfo = (chat) => {
    if (!chat) {
      return "";
    }

    // Group chat
    if (chat.isGroupChat) {
      return `${chat.users?.length || 0} members`;
    }

    // One-to-one chat
    const otherUser = chat.users?.find(
      (chatUser) => chatUser._id !== user?._id
    );

    return otherUser?.email || "";
  };

  return (
    <Box
      display={{
        base: selectedChat ? "none" : "flex",
        md: "flex",
      }}
      flexDirection="column"
      width={{
        base: "100%",
        md: "32%",
      }}
      height="100%"
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      p={3}
      overflow="hidden"
    >
      {/* =========================
          HEADER
      ========================= */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pb={3}
      >
        <Text
          fontSize={{
            base: "22px",
            md: "24px",
          }}
          color="gray.700"
          fontWeight="600"
        >
          My Chats
        </Text>

        <GroupChatModal>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* =========================
          CHAT LIST
      ========================= */}
      {!chats ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          py={5}
        >
          <Spinner />
        </Box>
      ) : chats.length === 0 ? (
        <Box
          textAlign="center"
          py={8}
        >
          <Text
            color="gray.500"
            fontSize="sm"
          >
            No chats available
          </Text>

          <Text
            color="gray.400"
            fontSize="xs"
            mt={2}
          >
            Search for a user to start chatting.
          </Text>
        </Box>
      ) : (
        <VStack
          spacing={2}
          align="stretch"
          overflowY="auto"
          flex="1"
          pr={1}
        >
          {chats.map((chat) => (
            <Box
              key={chat._id}
              p={3}
              borderRadius="md"
              cursor="pointer"
              bg={
                selectedChat?._id === chat._id
                  ? "blue.100"
                  : "gray.100"
              }
              border="1px solid"
              borderColor={
                selectedChat?._id === chat._id
                  ? "blue.200"
                  : "gray.100"
              }
              _hover={{
                bg: "blue.50",
              }}
              onClick={() => setSelectedChat(chat)}
            >
              <Text
                fontWeight="600"
                noOfLines={1}
              >
                {getChatName(chat)}
              </Text>

              <Text
                fontSize="xs"
                color="gray.500"
                noOfLines={1}
                mt={1}
              >
                {getChatInfo(chat)}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default MyChats;
