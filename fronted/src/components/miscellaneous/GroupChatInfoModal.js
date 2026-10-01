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

  const removeGroupMember = async (member) => {
    if (member._id === user?._id) {
      toast({
        title: "Cannot remove yourself",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (removingUserId) return;

    try {
      setRemovingUserId(member._id);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: chat._id, userId: member._id },
        config
      );

      setSelectedChat(data);
      setChats((currentChats) =>
        Array.isArray(currentChats)
          ? currentChats.map((currentChat) =>
              currentChat._id === data._id ? data : currentChat
            )
          : currentChats
      );
    } catch (error) {
      toast({
        title: "Could not remove member",
        description: error?.response?.data?.message || "Please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setRemovingUserId(null);
    }
  };

  return (
    <>
      <Box as="span" onClick={onOpen} cursor="pointer" display="inline-flex">
        {children}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {chat?.chatName || "Group Chat"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box maxHeight="280px" overflowY="auto">
              <Wrap spacing={1}>
                {chat?.users?.map((member) => (
                  <UserBadgeItem
                    key={member._id}
                    user={member}
                    handleFunction={() => removeGroupMember(member)}
                  />
                ))}
              </Wrap>
              {removingUserId && (
                <Box mt={2} fontSize="xs" color="gray.500">
                  Removing member...
                </Box>
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatInfoModal;
