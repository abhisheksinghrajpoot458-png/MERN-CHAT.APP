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
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://mern-chat-app-3oqx.onrender.com";

  const { user, chats, setChats, setSelectedChat } = ChatState();

  // ========================================
  // SEARCH USERS
  // ========================================

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    if (!user?.token) {
      toast({
        title: "Please login again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });

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
        `${API_URL}/api/user?search=${encodeURIComponent(query.trim())}`,
        config
      );

      // Normalize API response
      let users = [];

      if (Array.isArray(data)) {
        users = data;
      } else if (Array.isArray(data?.users)) {
        users = data.users;
      } else if (Array.isArray(data?.data)) {
        users = data.data;
      }

      setSearchResult(users);
    } catch (error) {
      console.error("Search Error:", error);

      setSearchResult([]);

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
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SELECT USER
  // ========================================

  const handleGroup = (selectedUser) => {
    if (!selectedUser?._id) {
      return;
    }

    setSelectedUsers((prevUsers) => {
      const users = Array.isArray(prevUsers) ? prevUsers : [];

      const alreadySelected = users.some(
        (user) => user?._id === selectedUser._id
      );

      if (alreadySelected) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

        return users;
      }

      return [...users, selectedUser];
    });

    setSearch("");
    setSearchResult([]);
  };

  // ========================================
  // DELETE SELECTED USER
  // ========================================

  const handleDelete = (userToDelete) => {
    if (!userToDelete?._id) return;

    setSelectedUsers((prevUsers) => {
      const users = Array.isArray(prevUsers) ? prevUsers : [];

      return users.filter(
        (selectedUser) =>
          selectedUser?._id !== userToDelete._id
      );
    });
  };

  // ========================================
  // CREATE GROUP CHAT
  // ========================================

  const handleSubmit = async () => {
    const users = Array.isArray(selectedUsers)
      ? selectedUsers
      : [];

    const chatName = groupChatName.trim();

    if (!chatName) {
      toast({
        title: "Please enter a group name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (users.length < 2) {
      toast({
        title: "Please select at least 2 users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (!user?.token) {
      toast({
        title: "Please login again",
        status: "error",
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const userIds = users
        .map((selectedUser) => selectedUser?._id)
        .filter(Boolean);

      if (userIds.length < 2) {
        toast({
          title: "Invalid users",
          description: "Please select at least 2 valid users.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        return;
      }

      const { data } = await axios.post(
        `${API_URL}/api/chat/group`,
        {
          name: chatName,
          users: JSON.stringify(userIds),
        },
        config
      );

      // Validate created chat response
      if (!data || typeof data !== "object" || !data._id) {
        console.error("Invalid group chat response:", data);

        toast({
          title: "Invalid server response",
          description: "Group chat was not created correctly.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        return;
      }

      // IMPORTANT:
      // Always keep chats as an array.
      setChats((prevChats) => {
        const currentChats = Array.isArray(prevChats)
          ? prevChats
          : [];

        // Prevent duplicate chat
        const alreadyExists = currentChats.some(
          (chat) => chat?._id === data._id
        );

        if (alreadyExists) {
          return currentChats;
        }

        return [data, ...currentChats];
      });

      setSelectedChat(data);

      toast({
        title: "Group Chat Created",
        description: `${chatName} has been created successfully`,
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
      console.error(
        "Create Group Chat Error:",
        error?.response?.data || error
      );

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

  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose = () => {
    if (loading) return;

    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);

    onClose();
  };

  // ========================================
  // SAFE ARRAYS
  // ========================================

  const safeSelectedUsers = Array.isArray(selectedUsers)
    ? selectedUsers
    : [];

  const safeSearchResult = Array.isArray(searchResult)
    ? searchResult
    : [];

  // chats is intentionally normalized here too.
  // This helps detect an invalid ChatProvider state.
  const safeChats = Array.isArray(chats) ? chats : [];

  // ========================================
  // UI
  // ========================================

  return (
    <>
      {/* OPEN MODAL */}

      <span
        onClick={onOpen}
        style={{ cursor: "pointer" }}
      >
        {children || "Open Modal"}
      </span>

      {/* MODAL */}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            Create Group Chat
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {/* GROUP NAME */}

            <FormControl mb={3}>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) =>
                  setGroupChatName(e.target.value)
                }
              />
            </FormControl>

            {/* SELECTED USERS */}

            <Box
              width="100%"
              display="flex"
              flexWrap="wrap"
              gap={2}
              mb={3}
            >
              {safeSelectedUsers.map((selectedUser) => (
                <Tag
                  size="md"
                  key={selectedUser?._id}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>
                    {selectedUser?.name || "Unknown User"}
                  </TagLabel>

                  <TagCloseButton
                    onClick={() =>
                      handleDelete(selectedUser)
                    }
                  />
                </Tag>
              ))}
            </Box>

            {/* SEARCH USERS */}

            <FormControl>
              <Input
                placeholder="Add Users eg: Abhi, Adarsh"
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
              />
            </FormControl>

            {/* LOADING */}

            {loading && (
              <Box mt={3}>
                <Spinner size="sm" />
              </Box>
            )}

            {/* SEARCH RESULTS */}

            {!loading &&
              safeSearchResult.length > 0 && (
                <Box
                  width="100%"
                  mt={2}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  maxHeight="180px"
                  overflowY="auto"
                >
                  {safeSearchResult.map((resultUser) => (
                    <Box
                      key={resultUser?._id}
                      p={3}
                      cursor="pointer"
                      _hover={{
                        background: "gray.100",
                      }}
                      onClick={() =>
                        handleGroup(resultUser)
                      }
                    >
                      <Text fontWeight="600">
                        {resultUser?.name || "Unknown User"}
                      </Text>

                      <Text
                        fontSize="sm"
                        color="gray.500"
                      >
                        {resultUser?.email || ""}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

            {/* NO RESULTS */}

            {!loading &&
              search.trim() &&
              safeSearchResult.length === 0 && (
                <Text
                  mt={3}
                  fontSize="sm"
                  color="gray.500"
                >
                  No users found
                </Text>
              )}
          </ModalBody>

          {/* FOOTER */}

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Creating..."
            >
              Create Chat
            </Button>

            <Button
              variant="ghost"
              onClick={handleClose}
              isDisabled={loading}
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
