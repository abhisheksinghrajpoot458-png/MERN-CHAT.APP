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

  const {
    user,
    chats,
    setChats,
    setSelectedChat,
  } = ChatState();

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
        `${API_URL}/api/user?search=${encodeURIComponent(
          query.trim()
        )}`,
        config
      );

      // IMPORTANT:
      // API response must be an array for .map()
      if (Array.isArray(data)) {
        setSearchResult(data);
      } else if (Array.isArray(data?.users)) {
        // Supports { users: [...] } response too
        setSearchResult(data.users);
      } else {
        console.error(
          "Unexpected user search response:",
          data
        );

        setSearchResult([]);
      }
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

    // Check duplicate by ID instead of object reference
    const alreadySelected = selectedUsers.some(
      (user) => user._id === selectedUser._id
    );

    if (alreadySelected) {
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

  // ========================================
  // DELETE SELECTED USER
  // ========================================

  const handleDelete = (userToDelete) => {
    setSelectedUsers((prev) =>
      prev.filter(
        (selected) =>
          selected._id !== userToDelete._id
      )
    );
  };

  // ========================================
  // CREATE GROUP CHAT
  // ========================================

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

      const userIds = selectedUsers
        .map((selectedUser) => selectedUser?._id)
        .filter(Boolean);

      const { data } = await axios.post(
        `${API_URL}/api/chat/group`,
        {
          name: groupChatName.trim(),
          users: JSON.stringify(userIds),
        },
        config
      );

      // Safely update chats
      setChats((prevChats) => [
        data,
        ...(Array.isArray(prevChats)
          ? prevChats
          : []),
      ]);

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
      console.error(
        "Create Group Chat Error:",
        error
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
    if (!loading) {
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
      onClose();
    }
  };

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
                  setGroupChatName(
                    e.target.value
                  )
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
              {Array.isArray(selectedUsers) &&
                selectedUsers.map(
                  (selectedUser) => (
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
                          handleDelete(
                            selectedUser
                          )
                        }
                      />
                    </Tag>
                  )
                )}
            </Box>

            {/* SEARCH USERS */}

            <FormControl>
              <Input
                placeholder="Add Users eg: Abhi, Adarsh"
                value={search}
                onChange={(e) =>
                  handleSearch(
                    e.target.value
                  )
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
                  {searchResult.map(
                    (resultUser) => (
                      <Box
                        key={resultUser._id}
                        p={3}
                        cursor="pointer"
                        _hover={{
                          background:
                            "gray.100",
                        }}
                        onClick={() =>
                          handleGroup(
                            resultUser
                          )
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
                    )
                  )}
                </Box>
              )}

            {/* NO RESULTS */}

            {!loading &&
              search.trim() &&
              Array.isArray(searchResult) &&
              searchResult.length === 0 && (
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
