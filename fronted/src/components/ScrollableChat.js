
import React from "react";

import {
  Avatar,
  Box,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import ScrollableFeed from "react-scrollable-feed";

import {
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
  isSameSender,
} from "../config/ChatLogics";

import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "../ProfileModal";

const ScrollableChat = ({ messages = [] }) => {
  const { user, selectedChat } = ChatState();

  // ==========================================
  // FORMAT MESSAGE TIME
  // ==========================================
  const formatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return "";
    }

    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // NO MESSAGES
  // ==========================================
  if (!Array.isArray(messages) || messages.length === 0) {
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={5}
      >
        <Text
          color="gray.500"
          fontSize="sm"
          textAlign="center"
        >
          No messages yet.
          <br />
          Start the conversation!
        </Text>
      </Box>
    );
  }

  return (
    <ScrollableFeed>
      <Box
        width="100%"
        px={{ base: 2, md: 4 }}
        py={4}
      >
        {messages.map((message, index) => {
          // ==========================================
          // CHECK SENDER
          // ==========================================
          const senderId =
            typeof message?.sender === "object"
              ? message?.sender?._id
              : message?.sender;

          const isMyMessage =
            senderId === user?._id;

          // ==========================================
          // SENDER OBJECT
          // ==========================================
          const sender =
            typeof message?.sender === "object"
              ? message.sender
              : null;

          // ==========================================
          // SAME SENDER
          // ==========================================
          const sameSender = isSameSender(
            messages,
            message,
            index,
            user?._id
          );

          // ==========================================
          // LAST MESSAGE FROM SAME SENDER
          // ==========================================
          const lastMessage = isLastMessage(
            messages,
            index,
            user?._id
          );

          // ==========================================
          // GROUP CHAT
          // ==========================================
          const isGroupChat =
            selectedChat?.isGroupChat === true;

          // ==========================================
          // MESSAGE TIME
          // ==========================================
          const messageTime =
            message?.createdAt ||
            message?.updatedAt;

          return (
            <Box
              key={
                message?._id ||
                `${message?.content}-${index}`
              }
              display="flex"
              justifyContent={
                isMyMessage
                  ? "flex-end"
                  : "flex-start"
              }
              alignItems="flex-end"
              width="100%"
              mt={isSameUser(messages, message, index) ? "3px" : "10px"}
            >
              {/* =====================================
                  RECEIVER AVATAR
              ====================================== */}
              {!isMyMessage &&
                (lastMessage || sameSender) && (
                  <Tooltip
                    label={
                      sender?.name ||
                      "User"
                    }
                    placement="left"
                  >
                    <Box display="inline-flex">
                      <ProfileModal
                        user={sender}
                        variant="chat"
                        triggerWidth="auto"
                      >
                        <Avatar
                          size="xs"
                          name={
                            sender?.name ||
                            "User"
                          }
                          src={
                            sender?.pic || ""
                          }
                          mr={2}
                          flexShrink={0}
                        />
                      </ProfileModal>
                    </Box>
                  </Tooltip>
                )}

              {/* =====================================
                  MESSAGE BUBBLE
              ====================================== */}
              <Box
                ml={isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user?._id
                )}
                maxW={{
                  base: "78%",
                  sm: "70%",
                  md: "60%",
                  lg: "55%",
                }}
                bg={
                  isMyMessage
                    ? "blue.500"
                    : "white"
                }
                color={
                  isMyMessage
                    ? "white"
                    : "gray.800"
                }
                px={4}
                py={2}
                borderRadius="18px"
                borderBottomRightRadius={
                  isMyMessage
                    ? "4px"
                    : "18px"
                }
                borderBottomLeftRadius={
                  isMyMessage
                    ? "18px"
                    : "4px"
                }
                boxShadow="sm"
                border={
                  isMyMessage
                    ? "none"
                    : "1px solid"
                }
                borderColor={
                  isMyMessage
                    ? "transparent"
                    : "gray.200"
                }
              >
                {/* =====================================
                    GROUP CHAT SENDER NAME
                ====================================== */}
                {isGroupChat &&
                  !isMyMessage &&
                  !sameSender &&
                  sender?.name && (
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color="blue.500"
                      mb={1}
                    >
                      {sender.name}
                    </Text>
                  )}

                {/* =====================================
                    MESSAGE CONTENT
                ====================================== */}
                <Text
                  fontSize="sm"
                  lineHeight="1.5"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {message?.content || ""}
                </Text>

                {/* =====================================
                    MESSAGE TIME
                ====================================== */}
                {messageTime && (
                  <Text
                    fontSize="9px"
                    textAlign="right"
                    mt={1}
                    opacity={0.7}
                  >
                    {formatTime(
                      messageTime
                    )}
                  </Text>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </ScrollableFeed>
  );
};

export default ScrollableChat;

