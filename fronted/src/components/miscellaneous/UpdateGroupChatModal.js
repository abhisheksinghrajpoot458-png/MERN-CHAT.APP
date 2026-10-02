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
  Avatar,
  Flex,
  Wrap,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

// ==========================================
// BACKEND API URL
// ==========================================
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://mern-chat-app-3oqx.onrender.com";

const UpdateGroupChatModal = ({
  children,
  fetchAgain,
  setFetchAgain,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    selectedChat,
    setSelectedChat,
    setChats,
    user,
  } = ChatState();

  const [groupChatName, setGroupChatName] = useState(
    selectedChat?.chatName || ""
  );

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  // ==========================================
  // UPDATE CHAT STATE
  // ==========================================
  const updateChatState = (updatedChat) => {
    if (!updatedChat?._id) {
      return;
    }

    setSelectedChat(updatedChat);

    setChats((currentChats) =>
      Array.isArray(currentChats)
        ? currentChats.map((chat) =>
            chat._id === updatedChat._id
              ? updatedChat
              : chat
          )
        : currentChats
    );

    if (setFetchAgain) {
      setFetchAgain((prev) => !prev);
    }
  };

  // ==========================================
  // SEARCH USERS
  // ==========================================
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    if (!user?.token) {
      toast({
        title: "Authentication required",
        description: "Please login again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
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
      console.error("Search User Error:", error);
      console.error(
        "Search Status:",
        error?.response?.status
      );
      console.error(
        "Search Response:",
        error?.response?.data
      );

      setSearchResult([]);

      toast({
        title: "Error Occurred",
        description:
          error?.response?.data?.message ||
          "Failed to load users",
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
  // RENAME GROUP
  // ==========================================
  const handleRename = async () => {
    if (!groupChatName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a group name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (!selectedChat?._id || !user?.token) {
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

      const { data } = await axios.put(
        `${API_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName.trim(),
        },
        config
      );

      updateChatState(data);

      toast({
        title: "Group name updated",
        description:
          "Group chat name changed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Rename Group Error:", error);
      console.error(
        "Rename Status:",
        error?.response?.status
      );
      console.error(
        "Rename Response:",
        error?.response?.data
      );

      toast({
        title: "Error Occurred",
        description:
          error?.response?.data?.message ||
          "Failed to rename group",
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
  // ADD USER TO GROUP
  // ==========================================
  const handleAddUser = async (userToAdd) => {
    if (!selectedChat?._id || !user?.token) {
      return;
    }

    if (!userToAdd?._id) {
      return;
    }

    const alreadyInGroup =
      selectedChat.users?.some(
        (chatUser) =>
          String(chatUser._id) ===
          String(userToAdd._id)
      );

    if (alreadyInGroup) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
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

      const { data } = await axios.put(
        `${API_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      console.log("Group after adding user:", data);

      updateChatState(data);

      setSearch("");
      setSearchResult([]);

      toast({
        title: "User Added",
        description: `${userToAdd.name} was added to the group`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Add User Error:", error);
      console.error(
        "Add User Status:",
        error?.response?.status
      );
      console.error(
        "Add User Response:",
        error?.response?.data
      );

      toast({
        title: "Error Occurred",
        description:
          error?.response?.data?.message ||
          "Failed to add user",
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
  // REMOVE ANOTHER USER FROM GROUP
  // ==========================================
  const handleRemoveUser = async (userToRemove) => {
    if (!selectedChat?._id || !user?.token) {
      return;
    }

    if (!userToRemove?._id) {
      return;
    }

    // Prevent removing yourself through admin remove action.
    if (
      String(userToRemove._id) ===
      String(user._id)
    ) {
      toast({
        title: "Use Leave Group",
        description:
          "To remove yourself, use the Leave Group button.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom",
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

      console.log("Removing group member:", {
        API: `${API_URL}/api/chat/groupremove`,
        chatId: selectedChat._id,
        userId: userToRemove._id,
      });

      const { data } = await axios.put(
        `${API_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      console.log(
        "Group after removing user:",
        data
      );

      updateChatState(data);

      toast({
        title: "User Removed",
        description:
          `${userToRemove.name} was removed from the group`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error(
        "Remove User Error:",
        error
      );

      console.error(
        "Remove User Status:",
        error?.response?.status
      );

      console.error(
        "Remove User Response:",
        error?.response?.data
      );

      toast({
        title: "Error Occurred",
        description:
          error?.response?.data?.message ||
          "Failed to remove user",
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
  // LEAVE GROUP
  // ==========================================
  const handleLeaveGroup = async () => {
    if (
      !selectedChat?._id ||
      !user?._id ||
      !user?.token
    ) {
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

      console.log("Leaving group:", {
        API: `${API_URL}/api/chat/groupremove`,
        chatId: selectedChat._id,
        userId: user._id,
      });

      await axios.put(
        `${API_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );

      // Remove group from chat list
      setChats((currentChats) =>
        Array.isArray(currentChats)
          ? currentChats.filter(
              (chat) =>
                chat._id !== selectedChat._id
            )
          : currentChats
      );

      // Clear selected chat
      setSelectedChat(null);

      // Close modal
      onClose();

      toast({
        title: "You left the group",
        description:
          "You have successfully left the group chat.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error(
        "Leave Group Error:",
        error
      );

      console.error(
        "Leave Group Status:",
        error?.response?.status
      );

      console.error(
        "Leave Group Response:",
        error?.response?.data
      );

      toast({
        title: "Could not leave group",
        description:
          error?.response?.data?.message ||
          "Please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OPEN MODAL
  // ==========================================
  const handleOpen = () => {
    setGroupChatName(
      selectedChat?.chatName || ""
    );

    setSearch("");
    setSearchResult([]);

    onOpen();
  };

  // ==========================================
  // NOT GROUP CHAT
  // ==========================================
  if (!selectedChat?.isGroupChat) {
    return null;
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <Box
        as="span"
        onClick={handleOpen}
        cursor="pointer"
        display="inline-flex"
      >
        {children || (
          <Button
            size="sm"
            colorScheme="blue"
          >
            Update Group
          </Button>
        )}
      </Box>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="md"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader textAlign="center">
            {selectedChat.chatName ||
              "Group Chat"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            {/* CURRENT MEMBERS */}
            <Wrap
              maxHeight="200px"
              overflowY="auto"
              mb={4}
            >
              {selectedChat.users?.map(
                (groupUser) => {
                  const isCurrentUser =
                    String(groupUser._id) ===
                    String(user?._id);

                  return (
                    <UserBadgeItem
                      key={groupUser._id}
                      user={groupUser}
                      handleFunction={
                        isCurrentUser
                          ? undefined
                          : () =>
                              handleRemoveUser(
                                groupUser
                              )
                      }
                    />
                  );
                }
              )}
            </Wrap>

            {/* GROUP NAME */}
            <FormControl mb={3}>
              <Flex gap={2}>
                <Input
                  value={groupChatName}
                  placeholder="Enter group name"
                  onChange={(e) =>
                    setGroupChatName(
                      e.target.value
                    )
                  }
                />

                <Button
                  colorScheme="blue"
                  onClick={handleRename}
                  isLoading={loading}
                >
                  Update
                </Button>
              </Flex>
            </FormControl>

            {/* ADD USER */}
            <Input
              placeholder="Search user by name or email"
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />

            {/* LOADING */}
            {loading && (
              <Flex
                justifyContent="center"
                mt={3}
              >
                <Spinner size="sm" />
              </Flex>
            )}

            {/* SEARCH RESULTS */}
            {!loading &&
              searchResult.length > 0 && (
                <Box
                  mt={2}
                  maxHeight="180px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  {searchResult.map(
                    (searchedUser) => (
                      <Flex
                        key={
                          searchedUser._id
                        }
                        p={3}
                        alignItems="center"
                        cursor="pointer"
                        _hover={{
                          bg: "gray.100",
                        }}
                        onClick={() =>
                          handleAddUser(
                            searchedUser
                          )
                        }
                      >
                        <Avatar
                          size="sm"
                          name={
                            searchedUser.name
                          }
                          src={
                            searchedUser.pic
                          }
                          mr={3}
                        />

                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                          >
                            {
                              searchedUser.name
                            }
                          </Text>

                          <Text
                            fontSize="xs"
                            color="gray.500"
                          >
                            {
                              searchedUser.email
                            }
                          </Text>
                        </Box>
                      </Flex>
                    )
                  )}
                </Box>
              )}

            {/* NO RESULTS */}
            {!loading &&
              search.trim() &&
              searchResult.length ===
                0 && (
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
            <Flex
              width="100%"
              justifyContent="space-between"
            >
              <Button
                colorScheme="red"
                onClick={handleLeaveGroup}
                isLoading={loading}
                isDisabled={loading}
              >
                Leave Group
              </Button>

              <Button
                colorScheme="blue"
                onClick={onClose}
                isDisabled={loading}
              >
                Close
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
