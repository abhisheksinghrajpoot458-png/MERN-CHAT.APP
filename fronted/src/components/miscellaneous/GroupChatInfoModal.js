import React, { useState } from "react";
import axios from "axios";

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Wrap,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatInfoModal = ({ chat, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, setChats } = ChatState();

  const [removingUserId, setRemovingUserId] = useState(null);

  const toast = useToast();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://mern-chat-app-3oqx.onrender.com";

  // ========================================
  // REMOVE GROUP MEMBER
  // ========================================

  const removeGroupMember = async (member) => {
    if (!member?._id) {
      return;
    }

    // Don't allow current user to remove themselves
    if (member._id === user?._id) {
      toast({
        title: "Cannot remove yourself",
        description:
          "You cannot remove yourself from the group.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    if (removingUserId) {
      return;
    }

    if (!user?.token) {
      toast({
        title: "Please login again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    if (!chat?._id) {
      toast({
        title: "Invalid group",
        description:
          "Group information is not available.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    try {
      setRemovingUserId(member._id);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/chat/groupremove`,
        {
          chatId: chat._id,
          userId: member._id,
        },
        config
      );

      // Update selected chat
      setSelectedChat(data);

      // Update chat in chats list
      setChats((currentChats) => {
        if (!Array.isArray(currentChats)) {
          return [];
        }

        return currentChats.map((currentChat) =>
          currentChat._id === data._id
            ? data
            : currentChat
        );
      });

      toast({
        title: "Member removed",
        description: `${member.name || "User"} was removed from the group.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error(
        "Remove Group Member Error:",
        error
      );

      toast({
        title: "Could not remove member",
        description:
          error?.response?.data?.message ||
          "Please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setRemovingUserId(null);
    }
  };

  // ========================================
  // SAFE USERS ARRAY
  // ========================================

  const groupMembers = Array.isArray(chat?.users)
    ? chat.users
    : [];

  // ========================================
  // UI
  // ========================================

  return (
    <>
      {/* OPEN MODAL */}

      <Box
        as="span"
        onClick={onOpen}
        cursor="pointer"
        display="inline-flex"
      >
        {children}
      </Box>

      {/* MODAL */}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="sm"
      >
        <ModalOverlay />

        <ModalContent>
          {/* HEADER */}

          <ModalHeader textAlign="center">
            {chat?.chatName || "Group Chat"}
          </ModalHeader>

          <ModalCloseButton />

          {/* BODY */}

          <ModalBody>
            <Box
              maxHeight="280px"
              overflowY="auto"
            >
              {groupMembers.length > 0 ? (
                <Wrap spacing={1}>
                  {groupMembers.map((member) => (
                    <UserBadgeItem
                      key={member._id}
                      user={member}
                      handleFunction={() =>
                        removeGroupMember(member)
                      }
                    />
                  ))}
                </Wrap>
              ) : (
                <Text
                  textAlign="center"
                  color="gray.500"
                  fontSize="sm"
                  py={4}
                >
                  No members found.
                </Text>
              )}

              {/* REMOVE LOADING */}

              {removingUserId && (
                <Box
                  mt={3}
                  textAlign="center"
                >
                  <Text
                    fontSize="xs"
                    color="gray.500"
                  >
                    Removing member...
                  </Text>
                </Box>
              )}
            </Box>
          </ModalBody>

          {/* FOOTER */}

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatInfoModal;
