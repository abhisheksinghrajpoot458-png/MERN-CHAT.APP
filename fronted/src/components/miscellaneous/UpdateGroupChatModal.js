
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

const UpdateGroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {
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

  const updateChatState = (updatedChat) => {
    setSelectedChat(updatedChat);
    setChats((currentChats) =>
      Array.isArray(currentChats)
        ? currentChats.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          )
        : currentChats
    );

    if (setFetchAgain) {
      setFetchAgain(!fetchAgain);
    }
  };

  // =========================
  // SEARCH USERS
  // =========================
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
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${encodeURIComponent(query)}`,
        config
      );

      setSearchResult(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Search User Error:", error);

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

  // =========================
  // RENAME GROUP
  // =========================
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

    if (!selectedChat?._id) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName.trim(),
        },
        config
      );

      updateChatState(data);

      toast({
        title: "Group name updated",
        description: "Group chat name changed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Rename Group Error:", error);

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

  // =========================
  // ADD USER TO GROUP
  // =========================
  const handleAddUser = async (userToAdd) => {
    if (!selectedChat?._id) {
      return;
    }

    // Check if user already exists
    const alreadyInGroup =
      selectedChat.users?.some(
        (chatUser) =>
          chatUser._id === userToAdd._id
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
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

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

  // =========================
  // REMOVE USER FROM GROUP
  // =========================
  const handleRemoveUser = async (userToRemove) => {
    if (!selectedChat?._id) {
      return;
    }

    // Don't remove yourself
    if (userToRemove._id === user?._id) {
      toast({
        title: "Cannot remove yourself",
        description:
          "You cannot remove yourself from the group",
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
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      updateChatState(data);

      toast({
        title: "User Removed",
        description: `${userToRemove.name} was removed from the group`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Remove User Error:", error);

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

  const handleLeaveGroup = async () => {
    if (!selectedChat?._id || !user?._id) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user._id },
        config
      );

      setChats((currentChats) =>
        Array.isArray(currentChats)
          ? currentChats.filter((chat) => chat._id !== selectedChat._id)
          : currentChats
      );
      setSelectedChat(null);
      onClose();
      toast({
        title: "You left the group",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Could not leave group",
        description: error?.response?.data?.message || "Please try again",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN MODAL
  // =========================
  const handleOpen = () => {
    setGroupChatName(
      selectedChat?.chatName || ""
    );

    setSearch("");
    setSearchResult([]);

    onOpen();
  };

  // =========================
  // NOT GROUP CHAT
  // =========================
  if (!selectedChat?.isGroupChat) {
    return null;
  }

  return (
    <>
      {/* =========================
          OPEN BUTTON
      ========================= */}
      <Box as="span" onClick={handleOpen} cursor="pointer" display="inline-flex">
        {children || (
          <Button size="sm" colorScheme="blue">
            Update Group
          </Button>
        )}
      </Box>

      {/* =========================
          MODAL
      ========================= */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="md"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader textAlign="center">
            {selectedChat.chatName || "Group Chat"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            {/* =========================
                CURRENT MEMBERS
            ========================= */}
            <Wrap maxHeight="200px" overflowY="auto" mb={4}>
              {selectedChat.users?.map((groupUser) => (
                <UserBadgeItem
                  key={groupUser._id}
                  user={groupUser}
                  handleFunction={() => handleRemoveUser(groupUser)}
                />
              ))}
            </Wrap>

            {/* =========================
                GROUP NAME
            ========================= */}
            <FormControl mb={3}>
              <Flex gap={2}>
                <Input
                  value={groupChatName}
                  placeholder="Enter group name"
                  onChange={(e) => setGroupChatName(e.target.value)}
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

            {/* =========================
                ADD USER
            ========================= */}
            <Input
              placeholder="Search user by name or email"
              value={search}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
            />

            {/* Loading */}
            {loading && (
              <Flex
                justifyContent="center"
                mt={3}
              >
                <Spinner size="sm" />
              </Flex>
            )}

            {/* Search Results */}
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

            {/* No Results */}
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

          {/* =========================
              FOOTER
          ========================= */}
          <ModalFooter>
            <Flex width="100%" justifyContent="space-between">
              <Button
                colorScheme="red"
                onClick={handleLeaveGroup}
                isLoading={loading}
              >
                Leave Group
              </Button>
              <Button colorScheme="blue" onClick={onClose}>
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
