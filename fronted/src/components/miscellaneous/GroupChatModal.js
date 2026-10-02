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

// Backend API URL
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://mern-chat-app-3oqx.onrender.com";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  // Removed unused "chats" variable.
  const {
    user,
    setChats,
    setSelectedChat,
  } = ChatState();

  // ==========================================
  // Search Users
  // ==========================================
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/user?search=${encodeURIComponent(query)}`,
        config
      );

      console.log("User Search Response:", data);

      if (Array.isArray(data)) {
        setSearchResult(data);
      } else if (Array.isArray(data?.users)) {
        setSearchResult(data.users);
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error("Search Users Error:", error);
      console.error(
        "Search Users Status:",
        error?.response?.status
      );
      console.error(
        "Search Users Response:",
        error?.response?.data
      );

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

  // ==========================================
  // Select User
  // ==========================================
  const handleGroup = (selectedUser) => {
    if (
      selectedUsers.some(
        (user) => user._id === selectedUser._id
      )
    ) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    setSelectedUsers((prev) => [
      ...prev,
      selectedUser,
    ]);

    setSearch("");
    setSearchResult([]);
  };

  // ==========================================
  // Remove Selected User
  // ==========================================
  const handleDelete = (userToDelete) => {
    setSelectedUsers((prev) =>
      prev.filter(
        (selected) =>
          selected._id !== userToDelete._id
      )
    );
  };

  // ==========================================
  // Create Group Chat
  // ==========================================
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
        description:
          "A group chat must contain at least 2 other users.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (!user?.token) {
      toast({
        title: "Authentication required",
        description:
          "Please login again before creating a group chat.",
        status: "error",
        duration: 5000,
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
          "Content-Type": "application/json",
        },
      };

      const requestData = {
        name: groupChatName.trim(),
        users: JSON.stringify(
          selectedUsers.map(
            (selectedUser) => selectedUser._id
          )
        ),
      };

      console.log("Creating Group Chat:", requestData);
      console.log(
        "Group Chat API:",
        `${API_URL}/api/chat/group`
      );

      const { data } = await axios.post(
        `${API_URL}/api/chat/group`,
        requestData,
        config
      );

      console.log("Group Chat Created:", data);

      // Safely update chats
      setChats((prevChats) => {
        const existingChats = Array.isArray(prevChats)
          ? prevChats
          : [];

        return [data, ...existingChats];
      });

      // Select newly created chat
      setSelectedChat(data);

      toast({
        title: "Group Chat Created",
        description: `${groupChatName.trim()} has been created successfully`,
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

      // Close modal
      onClose();
    } catch (error) {
      console.error(
        "Create Group Chat Error:",
        error
      );

      console.error(
        "Create Group Chat Status:",
        error?.response?.status
      );

      console.error(
        "Create Group Chat Response:",
        error?.response?.data
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

  // ==========================================
  // Close Modal
  // ==========================================
  const handleClose = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    setLoading(false);

    onClose();
  };

  return (
    <>
      {/* Open Modal */}
      <span
        onClick={onOpen}
        style={{
          cursor: "pointer",
          display: "inline-block",
        }}
      >
        {children || "Open Modal"}
      </span>

      {/* Group Chat Modal */}
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
              {Array.isArray(selectedUsers) &&
                selectedUsers.map((selectedUser) => (
                  <Tag
                    size="md"
                    key={selectedUser._id}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                  >
                    <TagLabel>
                      {selectedUser.name}
                    </TagLabel>

                    <TagCloseButton
                      onClick={() =>
                        handleDelete(selectedUser)
                      }
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
            {!loading &&
              Array.isArray(searchResult) &&
              searchResult.length > 0 && (
                <Box
                  width="100%"
                  mt={2}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  maxHeight="180px"
                  overflowY="auto"
                >
                  {searchResult.map((resultUser) => (
                    <Box
                      key={resultUser._id}
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
                        {resultUser.name}
                      </Text>

                      <Text
                        fontSize="sm"
                        color="gray.500"
                      >
                        {resultUser.email}
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

            {/* No Results */}
            {!loading &&
              search.trim() &&
              Array.isArray(searchResult) &&
              searchResult.length === 0 && (
                <Text
                  width="100%"
                  mt={3}
                  fontSize="sm"
                  color="gray.500"
                  textAlign="center"
                >
                  No users found
                </Text>
              )}
          </ModalBody>

          {/* Footer */}
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Creating"
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
