
import React, { useState } from "react";
import axios from "axios";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  Input,
  Text,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { ChatState } from "../../Context/ChatProvider";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://mern-chat-app-3oqx.onrender.com";
  const toast = useToast();

  const {
    user,
    chats,
    setChats,
    setSelectedChat,
  } = ChatState();

  // Search users
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/user?search=${encodeURIComponent(query)}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);

      toast({
        title: "Error Occurred",
        description:
          error?.response?.data?.message ||
          "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Select user
  const handleGroup = (selectedUser) => {
    if (selectedUsers.includes(selectedUser)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    setSelectedUsers([...selectedUsers, selectedUser]);
    setSearch("");
    setSearchResult([]);
  };

  // Remove selected user
  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter(
        (selected) => selected._id !== userToDelete._id
      )
    );
  };

  // Create group chat
  const handleSubmit = async () => {
    if (!groupChatName.trim()) {
      toast({
        title: "Please enter a group name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast({
        title: "Please select at least 2 users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
       `${API_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(
            selectedUsers.map((user) => user._id)
          ),
        },
        config
      );

      setChats([data, ...chats]);
      setSelectedChat(data);

      toast({
        title: "Group Chat Created",
        description: `${groupChatName} has been created successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      // Reset form
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);

      onClose();
    } catch (error) {
      toast({
        title: "Error Occurred",
        description:
          error?.response?.data?.message ||
          "Failed to create group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open Modal */}
      <span
        onClick={onOpen}
        style={{ cursor: "pointer" }}
      >
        {children || "Open Modal"}
      </span>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {/* Group Name */}
            <FormControl mb={3}>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) =>
                  setGroupChatName(e.target.value)
                }
              />
            </FormControl>

            {/* Selected Users */}
            <Box
              width="100%"
              display="flex"
              flexWrap="wrap"
              gap={2}
              mb={3}
            >
              {selectedUsers.map((user) => (
                <Tag
                  size="md"
                  key={user._id}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{user.name}</TagLabel>

                  <TagCloseButton
                    onClick={() => handleDelete(user)}
                  />
                </Tag>
              ))}
            </Box>

            {/* Search Users */}
            <FormControl>
              <Input
                placeholder="Add Users eg: Abhi, Adarsh"
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
              />
            </FormControl>

            {/* Loading */}
            {loading && (
              <Box mt={3}>
                <Spinner size="sm" />
              </Box>
            )}

            {/* Search Results */}
            {!loading && searchResult.length > 0 && (
              <Box
                width="100%"
                mt={2}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                maxHeight="180px"
                overflowY="auto"
              >
                {searchResult.map((user) => (
                  <Box
                    key={user._id}
                    p={3}
                    cursor="pointer"
                    _hover={{
                      background: "gray.100",
                    }}
                    onClick={() => handleGroup(user)}
                  >
                    <Text fontWeight="600">
                      {user.name}
                    </Text>

                    <Text
                      fontSize="sm"
                      color="gray.500"
                    >
                      {user.email}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={loading}
            >
              Create Chat
            </Button>

            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;


