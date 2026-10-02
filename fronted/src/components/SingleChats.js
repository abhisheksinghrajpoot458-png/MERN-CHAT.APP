


import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import {
  AddIcon,
  AttachmentIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  CalendarIcon,
  ChevronDownIcon,
  CopyIcon,
  DeleteIcon,
  EmailIcon,
  ChatIcon,
  InfoIcon,
  PhoneIcon,
  StarIcon,
  ViewIcon,
} from "@chakra-ui/icons";

import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "../ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

import io from "socket.io-client";

// ==========================================
// LOTTIE
// ==========================================

import Lottie from "react-lottie";
import typingAnimation from "../animations/typing.json";

// ==========================================
// CONSTANTS
// ==========================================

const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://mern-chat-app-3oqx.onrender.com";
// const ENDPOINT = "http://localhost:5000";

const reactionEmojis = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "🙏",
];

// ==========================================
// LOTTIE OPTIONS
// ==========================================

const typingOptions = {
  loop: true,
  autoplay: true,
  animationData: typingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

// ==========================================
// GET ID
// ==========================================

const getId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    return value?._id ? String(value._id) : "";
  }

  return String(value);
};

const formatLastSeen = (lastSeen) => {
  if (!lastSeen) {
    return "Last seen unavailable";
  }

  const date = new Date(lastSeen);

  if (Number.isNaN(date.getTime())) {
    return "Last seen unavailable";
  }

  return `Last seen ${date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
};

// ==========================================
// SINGLE CHATS
// ==========================================

const SingleChats = ({
  fetchAgain,
  setfetchAgain,
}) => {
  // ==========================================
  // CHAT STATE
  // ==========================================

  const {
    selectedChat,
    setSelectedChat,
    user,
    setNotifications,
  } = ChatState();

  // ==========================================
  // LOCAL STATES
  // ==========================================

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [replyTo, setReplyTo] =
    useState(null);

  const [uploadingAttachment, setUploadingAttachment] =
    useState(false);

  const [attachmentDialog, setAttachmentDialog] =
    useState(null);

  const [pollQuestion, setPollQuestion] =
    useState("");

  const [pollOptions, setPollOptions] =
    useState(["", ""]);

  const [eventTitle, setEventTitle] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [eventDescription, setEventDescription] =
    useState("");

  const [catalogueName, setCatalogueName] =
    useState("");

  const [cataloguePrice, setCataloguePrice] =
    useState("");

  const [catalogueDescription, setCatalogueDescription] =
    useState("");

  const [catalogueImageUrl, setCatalogueImageUrl] =
    useState("");

  const [hiddenMessageIds, setHiddenMessageIds] =
    useState([]);

  const [
    activeMessageActionsId,
    setActiveMessageActionsId,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [
    reactingMessageId,
    setReactingMessageId,
  ] = useState(null);

  const [
    socketConnected,
    setSocketConnected,
  ] = useState(false);

  const [isTyping, setIsTyping] =
    useState(false);

  const [presenceByUserId, setPresenceByUserId] =
    useState({});

  const hiddenMessagesStorageKey =
    user?._id && selectedChat?._id
      ? `hiddenMessages:${getId(user._id)}:${getId(selectedChat._id)}`
      : null;

  useEffect(() => {
    if (!hiddenMessagesStorageKey) {
      setHiddenMessageIds([]);
      return;
    }

    try {
      const savedIds = JSON.parse(
        localStorage.getItem(hiddenMessagesStorageKey) || "[]"
      );

      setHiddenMessageIds(
        Array.isArray(savedIds)
          ? savedIds.map(String)
          : []
      );
    } catch (error) {
      localStorage.removeItem(hiddenMessagesStorageKey);
      setHiddenMessageIds([]);
    }
  }, [hiddenMessagesStorageKey]);

  // ==========================================
  // TOAST
  // ==========================================

  const toast = useToast();

  // ==========================================
  // REFS
  // ==========================================

  const messagesEndRef = useRef(null);

  const messageInputRef = useRef(null);

  const documentInputRef = useRef(null);

  const mediaInputRef = useRef(null);

  const cameraInputRef = useRef(null);

  const audioInputRef = useRef(null);

  const socketRef = useRef(null);

  const selectedChatCompare = useRef(null);

  const typingTimeoutRef = useRef(null);

  // ==========================================
  // GET OTHER USER
  // ==========================================

  const getOtherUser = () => {
    if (
      !selectedChat ||
      selectedChat.isGroupChat
    ) {
      return null;
    }

    return selectedChat.users?.find(
      (chatUser) =>
        getId(chatUser) !== getId(user?._id)
    );
  };

  const otherUser = getOtherUser();
  const otherUserPresence = otherUser
    ? {
        ...otherUser,
        ...presenceByUserId[getId(otherUser)],
      }
    : null;

  // ==========================================
  // CHAT NAME
  // ==========================================

  const chatName = selectedChat?.isGroupChat
    ? selectedChat.chatName || "Group Chat"
    : otherUser?.name || "User";

  // ==========================================
  // SOCKET INITIALIZATION
  // ==========================================

  useEffect(() => {
    if (!user?.token) {
      return;
    }

    console.log(
      "Initializing Socket.IO..."
    );

    const chatSocket = io(API_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = chatSocket;

    // ========================================
    // SOCKET CONNECT
    // ========================================

    const handleConnect = () => {
      console.log(
        "================================"
      );

      console.log(
        "Socket connected:",
        chatSocket.id
      );

      console.log(
        "================================"
      );

      // IMPORTANT
      setSocketConnected(true);

      // Register user
      
      chatSocket.emit("setup", user);

      // Join selected chat
      const currentChatId =
        selectedChatCompare.current?._id;

      if (currentChatId) {
        console.log(
          "Joining chat:",
          currentChatId
        );

        chatSocket.emit(
          "join chat",
          currentChatId
        );
      }
    };

    // ========================================
    // SERVER CONNECTED
    // ========================================

    const handleConnected = () => {
      console.log(
        "Socket.IO setup completed"
      );

      setSocketConnected(true);

      const currentChatId =
        selectedChatCompare.current?._id;

      if (currentChatId) {
        chatSocket.emit(
          "join chat",
          currentChatId
        );
      }
    };

    // ========================================
    // SOCKET DISCONNECT
    // ========================================

    const handleDisconnect = (reason) => {
      console.log(
        "Socket disconnected:",
        reason
      );

      setSocketConnected(false);
      setIsTyping(false);
    };

    // ========================================
    // SOCKET ERROR
    // ========================================

    const handleConnectError = (error) => {
      console.error(
        "Socket connection error:",
        error?.message || error
      );

      setSocketConnected(false);
    };

    // ========================================
    // INCOMING MESSAGE
    // ========================================

    const handleIncomingMessage = (
      newMessageReceived
    ) => {
      console.log(
        "Realtime message received:",
        newMessageReceived
      );

      if (!newMessageReceived?._id) {
        return;
      }

      const receivedChatId = getId(
        newMessageReceived.chat
      );

      const currentChatId = getId(
        selectedChatCompare.current
      );

      if (receivedChatId !== currentChatId) {
        setNotifications((currentNotifications) => {
          if (
            currentNotifications.some(
              (notification) =>
                notification._id === getId(newMessageReceived._id)
            )
          ) {
            return currentNotifications;
          }

          const notificationChat = newMessageReceived.chat;
          const senderName = newMessageReceived.sender?.name;
          const chatName = notificationChat?.isGroupChat
            ? notificationChat.chatName
            : senderName;

          return [
            {
              _id: getId(newMessageReceived._id),
              chatId: receivedChatId,
              senderName,
              chatName,
              content: newMessageReceived.content,
            },
            ...currentNotifications,
          ].slice(0, 50);
        });
      }

      console.log(
        "Received chat:",
        receivedChatId
      );

      console.log(
        "Current chat:",
        currentChatId
      );

      // ======================================
      // MESSAGE FROM CURRENT CHAT
      // ======================================

      if (
        currentChatId &&
        receivedChatId === currentChatId
      ) {
        setMessages(
          (previousMessages) => {
            const messageAlreadyExists =
              previousMessages.some(
                (message) =>
                  getId(message?._id) ===
                  getId(
                    newMessageReceived?._id
                  )
              );

            if (messageAlreadyExists) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              newMessageReceived,
            ];
          }
        );
      }

      // ======================================
      // REFRESH CHAT LIST
      // ======================================

      if (
        typeof setfetchAgain === "function"
      ) {
        setfetchAgain(
          (previous) => !previous
        );
      }
    };

    // ========================================
    // INCOMING REACTION
    // ========================================

    const handleIncomingReaction = (
      updatedMessage
    ) => {
      if (!updatedMessage?._id) {
        return;
      }

      const updatedChatId = getId(
        updatedMessage.chat
      );

      const currentChatId = getId(
        selectedChatCompare.current
      );

      if (
        updatedChatId !== currentChatId
      ) {
        return;
      }

      setMessages(
        (currentMessages) =>
          currentMessages.map(
            (message) =>
              getId(message._id) ===
              getId(updatedMessage._id)
                ? updatedMessage
                : message
          )
      );
    };

    // ========================================
    // INCOMING DELETE
    // ========================================

    const handleIncomingDelete = (
      deletedData
    ) => {
      if (!deletedData?.messageId) {
        return;
      }

      const currentChatId = getId(
        selectedChatCompare.current
      );

      const deletedChatId = getId(
        deletedData.chatId
      );

      if (
        deletedChatId !== currentChatId
      ) {
        return;
      }

      setMessages(
        (currentMessages) =>
          currentMessages.filter(
            (message) =>
              getId(message._id) !==
              getId(
                deletedData.messageId
              )
          )
      );
    };

    const handleIncomingHideForMe = (deletedData) => {
      if (
        getId(deletedData?.chatId) !==
          getId(selectedChatCompare.current) ||
        !deletedData?.messageId
      ) {
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            getId(message._id) !== getId(deletedData.messageId)
        )
      );
    };

    // ========================================
    // INCOMING UPDATE
    // ========================================

    const handleIncomingUpdate = (
      updatedMessage
    ) => {
      if (!updatedMessage?._id) {
        return;
      }

      const currentChatId = getId(
        selectedChatCompare.current
      );

      const updatedChatId = getId(
        updatedMessage.chat
      );

      if (
        updatedChatId !== currentChatId
      ) {
        return;
      }

      setMessages(
        (currentMessages) =>
          currentMessages.map(
            (message) =>
              getId(message._id) ===
              getId(updatedMessage._id)
                ? updatedMessage
                : message
          )
      );
    };

    const updatePresence = (updates) => {
      const presenceList = Array.isArray(updates)
        ? updates
        : [updates];

      setPresenceByUserId((currentPresence) => {
        const nextPresence = { ...currentPresence };

        presenceList.forEach((presence) => {
          const userId = getId(presence?.userId);

          if (userId) {
            nextPresence[userId] = {
              isOnline: Boolean(presence.isOnline),
              lastSeen: presence.lastSeen || null,
            };
          }
        });

        return nextPresence;
      });
    };

    // ========================================
    // TYPING
    // ========================================

    const handleTyping = () => {
      setIsTyping(true);
    };

    // ========================================
    // STOP TYPING
    // ========================================

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    // ========================================
    // REGISTER LISTENERS
    // ========================================

    chatSocket.on(
      "connect",
      handleConnect
    );

    chatSocket.on(
      "connected",
      handleConnected
    );

    chatSocket.on(
      "disconnect",
      handleDisconnect
    );

    chatSocket.on(
      "connect_error",
      handleConnectError
    );

    chatSocket.on(
      "message received",
      handleIncomingMessage
    );

    chatSocket.on(
      "message reaction",
      handleIncomingReaction
    );

    chatSocket.on(
      "message deleted",
      handleIncomingDelete
    );

    chatSocket.on(
      "message hidden for me",
      handleIncomingHideForMe
    );

    chatSocket.on(
      "message updated",
      handleIncomingUpdate
    );

    chatSocket.on(
      "presence snapshot",
      updatePresence
    );

    chatSocket.on(
      "presence update",
      updatePresence
    );

    chatSocket.on(
      "typing",
      handleTyping
    );

    chatSocket.on(
      "stop typing",
      handleStopTyping
    );

    // ========================================
    // CLEANUP
    // ========================================

    return () => {
      console.log(
        "Cleaning Socket.IO connection"
      );

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      chatSocket.off(
        "connect",
        handleConnect
      );

      chatSocket.off(
        "connected",
        handleConnected
      );

      chatSocket.off(
        "disconnect",
        handleDisconnect
      );

      chatSocket.off(
        "connect_error",
        handleConnectError
      );

      chatSocket.off(
        "message received",
        handleIncomingMessage
      );

      chatSocket.off(
        "message reaction",
        handleIncomingReaction
      );

      chatSocket.off(
        "message deleted",
        handleIncomingDelete
      );

      chatSocket.off(
        "message hidden for me",
        handleIncomingHideForMe
      );

      chatSocket.off(
        "message updated",
        handleIncomingUpdate
      );

      chatSocket.off(
        "presence snapshot",
        updatePresence
      );

      chatSocket.off(
        "presence update",
        updatePresence
      );

      chatSocket.off(
        "typing",
        handleTyping
      );

      chatSocket.off(
        "stop typing",
        handleStopTyping
      );

      chatSocket.disconnect();

      if (
        socketRef.current ===
        chatSocket
      ) {
        socketRef.current = null;
      }

      setSocketConnected(false);
    };
  }, [user, setfetchAgain, setNotifications]);

  // ==========================================
  // SELECTED CHAT REF
  // ==========================================

  useEffect(() => {
    const previousChatId =
      selectedChatCompare.current?._id;

    const nextChatId =
      selectedChat?._id;

    // Update current chat reference
    selectedChatCompare.current =
      selectedChat || null;

    // ========================================
    // CHAT CHANGE
    // ========================================

    if (
      socketRef.current &&
      socketRef.current.connected &&
      previousChatId &&
      previousChatId !== nextChatId
    ) {
      console.log(
        "Leaving previous chat:",
        previousChatId
      );

      socketRef.current.emit(
        "stop typing",
        previousChatId
      );

      socketRef.current.emit(
        "leave chat",
        previousChatId
      );
    }

    setIsTyping(false);

    // ========================================
    // JOIN NEW CHAT
    // ========================================

    if (
      socketRef.current &&
      socketRef.current.connected &&
      nextChatId &&
      previousChatId !== nextChatId
    ) {
      console.log(
        "Joining new chat:",
        nextChatId
      );

      socketRef.current.emit(
        "join chat",
        nextChatId
      );
    }

    if (nextChatId) {
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification.chatId !== nextChatId
        )
      );
    }
  }, [selectedChat, setNotifications]);

  // ==========================================
  // FETCH MESSAGES
  // ==========================================

  useEffect(() => {
    const fetchMessages = async () => {
      if (
        !selectedChat?._id ||
        !user?.token
      ) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        };

        console.log(
          "Fetching messages for:",
          selectedChat._id
        );

        const { data } =
          await axios.get(
             `${API_URL}/api/message/${selectedChat._id}`,
            config
          );

        setMessages(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Fetch Messages Error:",
          error
        );

        setMessages([]);

        toast({
          title: "Error Occurred",
          description:
            error?.response?.data
              ?.message ||
            "Failed to load messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [
    selectedChat?._id,
    user?.token,
    toast,
  ]);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  }, [messages]);

  // ==========================================
  // HANDLE TYPING
  // ==========================================

  const handleMessageTyping = (
    event
  ) => {
    const value =
      event.target.value;

    setNewMessage(value);

    if (
      !socketRef.current ||
      !selectedChat?._id
    ) {
      return;
    }

    // ========================================
    // EMPTY INPUT
    // ========================================

    if (!value.trim()) {
      socketRef.current.emit(
        "stop typing",
        selectedChat._id
      );

      if (
        typingTimeoutRef.current
      ) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      return;
    }

    // ========================================
    // TYPING
    // ========================================

    socketRef.current.emit(
      "typing",
      selectedChat._id
    );

    // ========================================
    // CLEAR OLD TIMEOUT
    // ========================================

    if (
      typingTimeoutRef.current
    ) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    // ========================================
    // STOP TYPING AFTER 1.2 SEC
    // ========================================

    typingTimeoutRef.current =
      setTimeout(() => {
        socketRef.current?.emit(
          "stop typing",
          selectedChat._id
        );
      }, 1200);
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (messageOptions = {}) => {
    const messageText = (
      messageOptions.content ?? newMessage
    ).trim();
    const messageKind = messageOptions.kind || "text";
    const messagePayload = messageOptions.payload || null;

    if (
      (!messageText && !messagePayload) ||
      sending
    ) {
      return;
    }

    if (!selectedChat?._id) {
      toast({
        title: "No chat selected",
        description:
          "Please select a chat first",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    if (!user?.token) {
      toast({
        title:
          "Authentication Error",
        description:
          "Please login again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    // ========================================
    // STOP TYPING
    // ========================================

    if (
      typingTimeoutRef.current
    ) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    socketRef.current?.emit(
      "stop typing",
      selectedChat._id
    );

    // ========================================
    // REPLY
    // ========================================

    const replyTarget = replyTo;

    // ========================================
    // OPTIMISTIC ID
    // ========================================

    const optimisticId =
      `pending-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

    // ========================================
    // OPTIMISTIC MESSAGE
    // ========================================

    const optimisticMessage = {
      _id: optimisticId,

      content: messageText,

      kind: messageKind,

      payload: messagePayload,

      sender: {
        _id: user._id,
        name: user.name,
        pic: user.pic,
      },

      chat: selectedChat,

      replyTo: replyTarget,

      createdAt:
        new Date().toISOString(),

      reactions: [],

      pending: true,
    };

    // ========================================
    // SHOW IMMEDIATELY
    // ========================================

    setMessages(
      (currentMessages) => [
        ...currentMessages,
        optimisticMessage,
      ]
    );

    // ========================================
    // CLEAR INPUT
    // ========================================

    setNewMessage("");

    setReplyTo(null);

    try {
      setSending(true);

      const config = {
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${user.token}`,
        },
      };

      // ======================================
      // SAVE MESSAGE IN DATABASE
      // ======================================

      console.log(
        "Sending message to API..."
      );

      const { data } =
        await axios.post(
         `${API_URL}/api/message`,
          {
            content:
              messageText,

            kind: messageKind,

            payload: messagePayload,

            chatId:
              selectedChat._id,

            replyTo:
              replyTarget?._id ||
              null,
          },
          config
        );

      console.log(
        "Message saved:",
        data
      );

      // ======================================
      // REPLACE OPTIMISTIC MESSAGE
      // ======================================

      setMessages(
        (currentMessages) =>
          currentMessages.map(
            (message) =>
              message._id ===
              optimisticId
                ? data
                : message
          )
      );

      // ======================================
      // ⭐ IMPORTANT REALTIME SOCKET EVENT
      // ======================================

      if (
        socketRef.current &&
        socketRef.current.connected
      ) {
        console.log(
          "Emitting new message:",
          data
        );

        socketRef.current.emit(
          "new message",
          data
        );
      } else {
        console.warn(
          "Socket is not connected. Message saved but realtime event was not sent."
        );
      }

      // ======================================
      // UPDATE CHAT LIST
      // ======================================

      if (
        typeof setfetchAgain ===
        "function"
      ) {
        setfetchAgain(
          (previous) => !previous
        );
      }
    } catch (error) {
      console.error(
        "Send Message Error:",
        error
      );

      // ======================================
      // REMOVE OPTIMISTIC MESSAGE
      // ======================================

      setMessages(
        (currentMessages) =>
          currentMessages.filter(
            (message) =>
              message._id !==
              optimisticId
          )
      );

      // ======================================
      // RESTORE INPUT
      // ======================================

      setNewMessage(messageText);

      setReplyTo(replyTarget);

      toast({
        title: "Error Occurred",
        description:
          error?.response?.data
            ?.message ||
          "Failed to send message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setSending(false);
    }
  };

  const uploadAttachment = async (file, fileKind) => {
    if (!file) {
      return;
    }

    const maximumBytes = 20 * 1024 * 1024;

    if (file.size > maximumBytes) {
      toast({
        title: "File is too large",
        description: "Choose a file smaller than 20 MB",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setUploadingAttachment(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/tyo1eclb/auto/upload",
        formData
      );

      await sendMessage({
        content: file.name,
        kind: "file",
        payload: {
          fileKind,
          url: response.data.secure_url,
          name: file.name,
          mimeType: file.type,
          size: file.size,
          resourceType: response.data.resource_type,
        },
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error?.response?.data?.error?.message ||
          error?.message ||
          "Unable to upload this file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setUploadingAttachment(false);
    }
  };

  const sendContactCard = () => {
    sendMessage({
      content: user?.name || "Contact",
      kind: "contact",
      payload: {
        name: user?.name || "Contact",
        email: user?.email || "",
        pic: user?.pic || "",
      },
    });
  };

  const submitAttachmentDialog = () => {
    if (attachmentDialog === "poll") {
      const options = pollOptions
        .map((option) => option.trim())
        .filter(Boolean)
        .map((label) => ({ label, votes: [] }));
      const question = pollQuestion.trim();

      if (!question || options.length < 2) {
        toast({
          title: "Add a question and at least two options",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      sendMessage({
        content: question,
        kind: "poll",
        payload: { question, options },
      });
      setPollQuestion("");
      setPollOptions(["", ""]);
    } else if (attachmentDialog === "event") {
      if (!eventTitle.trim() || !eventDate) {
        toast({
          title: "Add an event title and date",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      sendMessage({
        content: eventTitle.trim(),
        kind: "event",
        payload: {
          title: eventTitle.trim(),
          date: eventDate,
          description: eventDescription.trim(),
        },
      });
      setEventTitle("");
      setEventDate("");
      setEventDescription("");
    } else if (attachmentDialog === "catalogue") {
      if (!catalogueName.trim()) {
        toast({
          title: "Add a product or service name",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      sendMessage({
        content: catalogueName.trim(),
        kind: "catalogue",
        payload: {
          name: catalogueName.trim(),
          price: cataloguePrice.trim(),
          description: catalogueDescription.trim(),
          imageUrl: catalogueImageUrl.trim(),
        },
      });
      setCatalogueName("");
      setCataloguePrice("");
      setCatalogueDescription("");
      setCatalogueImageUrl("");
    }

    setAttachmentDialog(null);
  };

  const sendPollVote = async (message, optionIndex) => {
    try {
      const { data } = await axios.patch(
       `${API_URL}/api/message/${message._id}/vote`,
        { optionIndex },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          getId(currentMessage._id) === getId(data._id)
            ? data
            : currentMessage
        )
      );
    } catch (error) {
      toast({
        title: "Vote not saved",
        description: error?.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // ==========================================
  // REACT TO MESSAGE
  // ==========================================

  const reactToMessage = async (
    messageId,
    emoji
  ) => {
    if (
      reactingMessageId ===
      messageId
    ) {
      return;
    }

    const messageToReact =
      messages.find(
        (message) =>
          getId(message._id) ===
          getId(messageId)
      );

    if (!messageToReact) {
      return;
    }

    const previousReactions =
      Array.isArray(
        messageToReact.reactions
      )
        ? messageToReact.reactions
        : [];

    const existingReaction =
      previousReactions.find(
        (reaction) => {
          const reactionUserId =
            typeof reaction.user ===
            "object"
              ? reaction.user?._id
              : reaction.user;

          return (
            getId(
              reactionUserId
            ) ===
            getId(user?._id)
          );
        }
      );

    let nextReactions;

    // ========================================
    // REMOVE
    // ========================================

    if (
      existingReaction?.emoji ===
      emoji
    ) {
      nextReactions =
        previousReactions.filter(
          (reaction) =>
            reaction !==
            existingReaction
        );
    }

    // ========================================
    // CHANGE
    // ========================================

    else if (
      existingReaction
    ) {
      nextReactions =
        previousReactions.map(
          (reaction) =>
            reaction ===
            existingReaction
              ? {
                  ...reaction,
                  emoji,
                }
              : reaction
        );
    }

    // ========================================
    // ADD
    // ========================================

    else {
      nextReactions = [
        ...previousReactions,
        {
          user: {
            _id: user._id,
            name: user.name,
          },
          emoji,
        },
      ];
    }

    setReactingMessageId(
      messageId
    );

    // ========================================
    // OPTIMISTIC REACTION
    // ========================================

    setMessages(
      (currentMessages) =>
        currentMessages.map(
          (message) =>
            getId(message._id) ===
            getId(messageId)
              ? {
                  ...message,
                  reactions:
                    nextReactions,
                }
              : message
        )
    );

    try {
      const config = {
        headers: {
          Authorization:
            `Bearer ${user.token}`,
        },
      };

      const { data } =
        await axios.patch(
          `${API_URL}/api/message/${messageId}/reactions`,
          { emoji },
          config
        );

      // ======================================
      // UPDATE LOCAL MESSAGE
      // ======================================

      setMessages(
        (currentMessages) =>
          currentMessages.map(
            (message) =>
              getId(message._id) ===
              getId(messageId)
                ? data
                : message
          )
      );

      // ======================================
      // SOCKET REACTION
      // ======================================

      if (
        socketRef.current &&
        socketRef.current.connected
      ) {
        socketRef.current.emit(
          "message reaction",
          data
        );
      }
    } catch (error) {
      // ======================================
      // RESTORE REACTION
      // ======================================

      setMessages(
        (currentMessages) =>
          currentMessages.map(
            (message) =>
              getId(message._id) ===
              getId(messageId)
                ? {
                    ...message,
                    reactions:
                      previousReactions,
                  }
                : message
          )
      );

      toast({
        title:
          "Reaction not saved",
        description:
          error?.response?.data
            ?.message ||
          "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setReactingMessageId(
        null
      );
    }
  };

  // ==========================================
  // COPY MESSAGE
  // ==========================================

  const copyMessage = async (
    content
  ) => {
    try {
      await navigator.clipboard.writeText(
        content || ""
      );

      toast({
        title:
          "Message copied",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title:
          "Could not copy message",
        description:
          "Clipboard access is unavailable",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // ==========================================
  // DELETE MESSAGE
  // ==========================================

  const deleteMessage = async (
    messageId,
    mode = "everyone"
  ) => {
    if (!user?.token) {
      return;
    }

    try {
      const { data } = await axios.delete(
       `${API_URL}/api/message/${messageId}`,
        {
          data: { mode },
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );

      // ======================================
      // REMOVE LOCALLY
      // ======================================

      if (mode === "me") {
        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) =>
              getId(message._id) !== getId(messageId)
          )
        );

        setHiddenMessageIds((currentIds) => {
          const messageIdString = getId(messageId);
          const nextIds = currentIds.includes(messageIdString)
            ? currentIds
            : [...currentIds, messageIdString];

          if (hiddenMessagesStorageKey) {
            localStorage.setItem(
              hiddenMessagesStorageKey,
              JSON.stringify(nextIds)
            );
          }

          return nextIds;
        });
      } else if (mode === "unsend") {
        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) =>
              getId(message._id) !== getId(messageId)
          )
        );
      } else if (data?.message) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            getId(message._id) === getId(messageId)
              ? data.message
              : message
          )
        );
      }

      // ======================================
      // CHAT LIST
      // ======================================

      if (
        typeof setfetchAgain ===
        "function"
      ) {
        setfetchAgain(
          (previous) => !previous
        );
      }
    } catch (error) {
      toast({
        title:
          "Message not deleted",
        description:
          error?.response?.data
            ?.message ||
          "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const deleteMessageForMe = (messageId) =>
    deleteMessage(messageId, "me");

  // ==========================================
  // START REPLY
  // ==========================================

  const startReply = (
    message
  ) => {
    setReplyTo(message);

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  // ==========================================
  // ENTER TO SEND
  // ==========================================

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!sending) {
        sendMessage();
      }
    }
  };

  const visibleMessages = messages.filter(
    (message) =>
      !hiddenMessageIds.includes(getId(message._id))
  );

  // ==========================================
  // NO CHAT SELECTED
  // ==========================================

  if (!selectedChat) {
    return (
      <Flex
        height="100%"
        width="100%"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        borderRadius="lg"
      >
        <Text
          color="gray.500"
          fontSize="lg"
          textAlign="center"
        >
          Select a chat to start
          messaging
        </Text>
      </Flex>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <Flex
      height="100%"
      width="100%"
      flexDirection="column"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <Flex
        alignItems="center"
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        {/* MOBILE BACK */}

        <IconButton
          display={{
            base: "flex",
            md: "none",
          }}
          mr={3}
          icon={<ArrowBackIcon />}
          aria-label="Back to chats"
          onClick={() =>
            setSelectedChat(null)
          }
        />

        {/* AVATAR */}

        <Avatar
          size="sm"
          name={chatName}
          src={
            !selectedChat.isGroupChat
              ? otherUser?.pic
              : undefined
          }
          mr={3}
        />

        {/* CHAT INFO */}

        <Box minW={0}>
          <Text
            fontWeight="600"
            fontSize="md"
            noOfLines={1}
          >
            {chatName}
          </Text>

          <Text
            fontSize="xs"
            color="gray.500"
            noOfLines={1}
          >
            {selectedChat.isGroupChat
              ? `${
                  selectedChat.users
                    ?.length || 0
                } members`
              : otherUser?.email || ""}
          </Text>

          {!selectedChat.isGroupChat && otherUserPresence && (
            <Text
              fontSize="xs"
              color={
                otherUserPresence.isOnline
                  ? "green.600"
                  : "gray.500"
              }
              noOfLines={1}
            >
              {otherUserPresence.isOnline
                ? "Online"
                : formatLastSeen(otherUserPresence.lastSeen)}
            </Text>
          )}

          {/* SOCKET STATUS */}

          <Text
            fontSize="10px"
            color={
              socketConnected
                ? "green.500"
                : "orange.500"
            }
            aria-live="polite"
          >
            {socketConnected
              ? "Connected"
              : "Reconnecting..."}
          </Text>
        </Box>

        {/* HEADER ACTION */}

        <Box
          ml="auto"
          pl={3}
          flexShrink={0}
        >
          {selectedChat.isGroupChat ? (
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setfetchAgain={
                setfetchAgain
              }
            >
              <IconButton
                icon={<ViewIcon />}
                aria-label="Manage group"
                variant="ghost"
              />
            </UpdateGroupChatModal>
          ) : otherUser ? (
            <ProfileModal
              user={otherUser}
              variant="chat"
              triggerWidth="auto"
            >
              <IconButton
                icon={<ViewIcon />}
                aria-label="View user profile"
                variant="ghost"
              />
            </ProfileModal>
          ) : null}
        </Box>
      </Flex>

      {/* =====================================
          MESSAGES
      ====================================== */}

      <Box
        flex="1"
        overflowY="auto"
        p={4}
        bg="gray.50"
      >
        {/* LOADING */}

        {loading ? (
          <Flex
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner
              size="lg"
              color="blue.500"
            />
          </Flex>
        ) : visibleMessages.length === 0 ? (
          <Flex
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color="gray.500"
              textAlign="center"
            >
              No messages yet.
              <br />
              Start the conversation!
            </Text>
          </Flex>
        ) : (
          visibleMessages.map((message) => {
            const isMyMessage =
              getId(
                message?.sender
              ) === getId(user?._id);

            return (
              <Flex
                key={message._id}
                role="group"
                width="100%"
                flexDirection="column"
                alignItems={
                  isMyMessage
                    ? "flex-end"
                    : "flex-start"
                }
                mb={3}
              >
                {/* MESSAGE ACTIONS */}

                <Flex
                  alignSelf={
                    isMyMessage
                      ? "flex-end"
                      : "flex-start"
                  }
                  alignItems="center"
                  gap={1}
                  p={1}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="full"
                  boxShadow="sm"
                  mb={1}
                  overflow="hidden"
                  display={{
                    base: message.deletedForEveryone || message.unsent
                      ? "none"
                      : activeMessageActionsId === message._id
                        ? "flex"
                        : "none",
                    md: message.deletedForEveryone || message.unsent
                      ? "none"
                      : "flex",
                  }}
                  maxH={{
                    base: "32px",
                    md: "0",
                  }}
                  opacity={{
                    base: 1,
                    md: 0,
                  }}
                  pointerEvents="auto"
                  transition="max-height 140ms ease, opacity 140ms ease"
                  _groupHover={{
                    opacity: 1,
                    maxH: "32px",
                  }}
                  _groupFocusWithin={{
                    opacity: 1,
                    maxH: "32px",
                  }}
                >
                  {/* REACTION */}

                  <Popover
                    placement="top"
                    isLazy
                  >
                    <PopoverTrigger>
                      <IconButton
                        icon={<AddIcon />}
                        aria-label="Add reaction"
                        title="Add reaction"
                        variant="ghost"
                        size="xs"
                        minW="30px"
                        h="30px"
                        isDisabled={
                          reactingMessageId ===
                          message._id
                        }
                      />
                    </PopoverTrigger>

                    <PopoverContent
                      width="auto"
                      minW="0"
                    >
                      <PopoverBody p={1}>
                        <Flex gap={1}>
                          {reactionEmojis.map(
                            (emoji) => (
                              <Button
                                key={emoji}
                                type="button"
                                aria-label={`React with ${emoji}`}
                                title={`React with ${emoji}`}
                                variant="ghost"
                                size="sm"
                                minW="36px"
                                h="36px"
                                px={1}
                                fontSize="lg"
                                isDisabled={
                                  reactingMessageId ===
                                  message._id
                                }
                                onClick={() =>
                                  reactToMessage(
                                    message._id,
                                    emoji
                                  )
                                }
                              >
                                {emoji}
                              </Button>
                            )
                          )}
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>

                  {/* MENU */}

                  <Menu placement="bottom">
                    <MenuButton
                      as={IconButton}
                      icon={
                        <ChevronDownIcon />
                      }
                      aria-label="Message options"
                      variant="ghost"
                      size="xs"
                      minW="30px"
                      h="30px"
                    />

                    <MenuList fontSize="sm">
                      <MenuItem
                        icon={
                          <ArrowBackIcon />
                        }
                        onClick={() =>
                          startReply(
                            message
                          )
                        }
                      >
                        Reply
                      </MenuItem>

                      <MenuItem
                        icon={<CopyIcon />}
                        onClick={() =>
                          copyMessage(
                            message.content
                          )
                        }
                      >
                        Copy
                      </MenuItem>

                      <MenuItem
                        icon={<DeleteIcon />}
                        onClick={() =>
                          deleteMessageForMe(message._id)
                        }
                      >
                        Delete for me
                      </MenuItem>
                      {isMyMessage && (
                        <>
                          <MenuItem
                            icon={<DeleteIcon />}
                            color="red.500"
                            onClick={() =>
                              deleteMessage(message._id, "everyone")
                            }
                          >
                            Delete for everyone
                          </MenuItem>
                          <MenuItem
                            icon={<DeleteIcon />}
                            color="red.600"
                            onClick={() =>
                              deleteMessage(message._id, "unsend")
                            }
                          >
                            Unsend
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </Flex>

                {/* MESSAGE BUBBLE */}

                <Box
                  onClick={() =>
                    setActiveMessageActionsId(
                      (currentId) =>
                        currentId ===
                        message._id
                          ? null
                          : message._id
                    )
                  }
                  maxWidth={{
                    base: "80%",
                    md: "65%",
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
                  borderRadius="lg"
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
                  {/* REPLY PREVIEW */}

                  {message.replyTo && (
                    <Box
                      mb={2}
                      px={2}
                      py={1}
                      borderLeft="3px solid"
                      borderColor={
                        isMyMessage
                          ? "blue.100"
                          : "blue.400"
                      }
                      bg={
                        isMyMessage
                          ? "whiteAlpha.200"
                          : "gray.100"
                      }
                      borderRadius="sm"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        noOfLines={1}
                      >
                        {message.replyTo
                          ?.sender
                          ?.name ||
                          "Reply"}
                      </Text>

                      <Text
                        fontSize="xs"
                        noOfLines={2}
                        opacity={0.85}
                      >
                        {
                          message.replyTo
                            ?.content
                        }
                      </Text>
                    </Box>
                  )}

                  {/* GROUP SENDER */}

                  {selectedChat.isGroupChat &&
                    !isMyMessage &&
                    message.sender?.name && (
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        mb={1}
                        color="blue.500"
                      >
                        {
                          message.sender
                            .name
                        }
                      </Text>
                    )}

                  {/* MESSAGE */}

                  {message.unsent || message.deletedForEveryone ? (
                    <Text
                      fontSize="sm"
                      fontStyle="italic"
                      color="gray.500"
                    >
                      {message.unsent
                        ? isMyMessage
                          ? "You unsent this message"
                          : "This message was unsent"
                        : isMyMessage
                          ? "You deleted this message"
                          : "This message was deleted"}
                    </Text>
                  ) : message.kind === "file" && message.payload?.url ? (
                    <Flex direction="column" gap={2}>
                      {message.payload.mimeType?.startsWith("image/") ? (
                        <Image
                          src={message.payload.url}
                          alt={message.payload.name || "Shared image"}
                          maxW="280px"
                          maxH="280px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      ) : message.payload.mimeType?.startsWith("video/") ? (
                        <Box
                          as="video"
                          src={message.payload.url}
                          controls
                          maxW="300px"
                          borderRadius="md"
                        />
                      ) : message.payload.mimeType?.startsWith("audio/") ? (
                        <Box as="audio" src={message.payload.url} controls />
                      ) : null}
                      <Link
                        href={message.payload.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color={isMyMessage ? "white" : "blue.600"}
                        textDecoration="underline"
                      >
                        {message.payload.name || message.content || "Open attachment"}
                      </Link>
                    </Flex>
                  ) : message.kind === "contact" ? (
                    <Flex alignItems="center" gap={3} minW="190px">
                      <Avatar
                        size="sm"
                        name={message.payload?.name || "Contact"}
                        src={message.payload?.pic || undefined}
                      />
                      <Box minW={0}>
                        <Text fontWeight="semibold" noOfLines={1}>
                          {message.payload?.name || "Contact"}
                        </Text>
                        <Text fontSize="xs" opacity={0.8} noOfLines={1}>
                          {message.payload?.email || ""}
                        </Text>
                      </Box>
                    </Flex>
                  ) : message.kind === "poll" ? (
                    <Box minW="220px">
                      <Text fontWeight="semibold" mb={2}>
                        {message.payload?.question || message.content}
                      </Text>
                      <Flex direction="column" gap={2}>
                        {(message.payload?.options || []).map((option, index) => {
                          const votes = Array.isArray(option.votes) ? option.votes : [];
                          const selected = votes.some((voterId) => getId(voterId) === getId(user?._id));
                          const totalVotes = (message.payload?.options || []).reduce(
                            (total, pollOption) => total + (pollOption.votes?.length || 0),
                            0
                          );
                          return (
                            <Button
                              key={`${option.label}-${index}`}
                              size="sm"
                              justifyContent="space-between"
                              colorScheme={selected ? "blue" : "gray"}
                              variant={selected ? "solid" : "outline"}
                              onClick={() => sendPollVote(message, index)}
                            >
                              <Text noOfLines={1}>{option.label}</Text>
                              <Text ml={3} fontSize="xs">
                                {votes.length}{totalVotes ? ` / ${totalVotes}` : ""}
                              </Text>
                            </Button>
                          );
                        })}
                      </Flex>
                    </Box>
                  ) : message.kind === "event" ? (
                    <Box minW="200px">
                      <Flex alignItems="center" gap={2} mb={1}>
                        <CalendarIcon />
                        <Text fontWeight="semibold">{message.payload?.title || message.content}</Text>
                      </Flex>
                      {message.payload?.date && (
                        <Text fontSize="xs">
                          {new Date(message.payload.date).toLocaleString()}
                        </Text>
                      )}
                      {message.payload?.description && (
                        <Text fontSize="sm" mt={1}>
                          {message.payload.description}
                        </Text>
                      )}
                    </Box>
                  ) : message.kind === "sticker" ? (
                    <Text fontSize="5xl" lineHeight="1.1">
                      {message.payload?.sticker || message.content}
                    </Text>
                  ) : message.kind === "catalogue" ? (
                    <Flex direction="column" gap={2} minW="200px">
                      {message.payload?.imageUrl && (
                        <Image
                          src={message.payload.imageUrl}
                          alt={message.payload?.name || "Catalogue item"}
                          maxW="260px"
                          maxH="180px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      <Text fontWeight="semibold">
                        {message.payload?.name || message.content}
                      </Text>
                      {message.payload?.price && (
                        <Text fontSize="sm" fontWeight="bold">
                          {message.payload.price}
                        </Text>
                      )}
                      {message.payload?.description && (
                        <Text fontSize="sm">
                          {message.payload.description}
                        </Text>
                      )}
                    </Flex>
                  ) : (
                    <Text
                      fontSize="sm"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {message.content}
                    </Text>
                  )}

                  {/* TIME */}

                  {(message.createdAt ||
                    message.updatedAt) && (
                    <Text
                      fontSize="9px"
                      textAlign="right"
                      mt={1}
                      opacity={0.7}
                    >
                      {message.pending
                        ? "Sending..."
                        : new Date(
                            message.createdAt ||
                              message.updatedAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                    </Text>
                  )}

                  {/* REACTIONS */}

                  {Array.isArray(
                    message.reactions
                  ) &&
                    message.reactions
                      .length > 0 && (
                      <Flex
                        mt={2}
                        gap={1}
                        wrap="wrap"
                      >
                        {Object.entries(
                          message.reactions.reduce(
                            (
                              groups,
                              reaction
                            ) => {
                              const reactionUserId =
                                typeof reaction.user ===
                                "object"
                                  ? reaction
                                      .user?._id
                                  : reaction.user;

                              if (
                                !groups[
                                  reaction
                                    .emoji
                                ]
                              ) {
                                groups[
                                  reaction
                                    .emoji
                                ] = {
                                  count: 0,
                                  selected:
                                    false,
                                };
                              }

                              groups[
                                reaction
                                  .emoji
                              ].count +=
                                1;

                              if (
                                getId(
                                  reactionUserId
                                ) ===
                                getId(
                                  user?._id
                                )
                              ) {
                                groups[
                                  reaction
                                    .emoji
                                ].selected =
                                  true;
                              }

                              return groups;
                            },
                            {}
                          )
                        ).map(
                          ([
                            emoji,
                            reaction,
                          ]) => (
                            <Button
                              key={emoji}
                              type="button"
                              size="xs"
                              h="24px"
                              minW="32px"
                              px={2}
                              borderRadius="full"
                              colorScheme={
                                reaction.selected
                                  ? "blue"
                                  : "gray"
                              }
                              variant={
                                reaction.selected
                                  ? "solid"
                                  : "outline"
                              }
                              isDisabled={
                                reactingMessageId ===
                                message._id
                              }
                              onClick={() =>
                                reactToMessage(
                                  message._id,
                                  emoji
                                )
                              }
                            >
                              {emoji}{" "}
                              {
                                reaction.count
                              }
                            </Button>
                          )
                        )}
                      </Flex>
                    )}
                </Box>
              </Flex>
            );
          })
        )}

        {/* SCROLL */}

        <div
          ref={messagesEndRef}
        />
      </Box>

      {/* =====================================
          INPUT AREA
      ====================================== */}

      <Box
        p={3}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        {/* REPLY BOX */}

        {replyTo && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            px={3}
            py={2}
            mb={2}
            bg="blue.50"
            borderLeft="3px solid"
            borderColor="blue.400"
            borderRadius="md"
          >
            <Box minW={0}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="blue.600"
              >
                Replying to{" "}
                {replyTo.sender?.name ||
                  "message"}
              </Text>

              <Text
                fontSize="sm"
                noOfLines={1}
                color="gray.700"
              >
                {replyTo.content}
              </Text>
            </Box>

            <IconButton
              icon={<DeleteIcon />}
              aria-label="Cancel reply"
              size="sm"
              variant="ghost"
              onClick={() =>
                setReplyTo(null)
              }
            />
          </Flex>
        )}

        {/* TYPING INDICATOR */}

        {isTyping && (
          <Flex
            alignItems="center"
            height="42px"
            px={2}
            mb={1}
          >
            <Lottie
              options={typingOptions}
              height={40}
              width={70}
              isClickToPauseDisabled={
                true
              }
            />

            <Text
              fontSize="xs"
              color="gray.500"
              ml={1}
            >
              typing...
            </Text>
          </Flex>
        )}

        {/* INPUT */}

        <Flex gap={2} alignItems="center">
          <Menu placement="top-start">
            <MenuButton
              as={IconButton}
              icon={<AttachmentIcon />}
              aria-label="Attach or share"
              title="Attach or share"
              variant="ghost"
              borderRadius="full"
              isLoading={uploadingAttachment}
              isDisabled={uploadingAttachment || sending}
            />
            <MenuList maxH="70vh" overflowY="auto" minW="220px">
              <MenuItem icon={<AttachmentIcon />} onClick={() => documentInputRef.current?.click()}>
                Document
              </MenuItem>
              <MenuItem icon={<ViewIcon />} onClick={() => mediaInputRef.current?.click()}>
                Photos &amp; videos
              </MenuItem>
              <MenuItem icon={<PhoneIcon />} onClick={() => cameraInputRef.current?.click()}>
                Camera
              </MenuItem>
              <MenuItem icon={<AttachmentIcon />} onClick={() => audioInputRef.current?.click()}>
                Audio
              </MenuItem>
              <MenuItem icon={<EmailIcon />} onClick={sendContactCard}>
                Contact
              </MenuItem>
              <MenuItem icon={<InfoIcon />} onClick={() => setAttachmentDialog("poll")}>
                Poll
              </MenuItem>
              <MenuItem icon={<CalendarIcon />} onClick={() => setAttachmentDialog("event")}>
                Event
              </MenuItem>
              <MenuItem icon={<StarIcon />} onClick={() => setAttachmentDialog("sticker")}>
                New sticker
              </MenuItem>
              <MenuItem icon={<ViewIcon />} onClick={() => setAttachmentDialog("catalogue")}>
                Catalogue
              </MenuItem>
              <MenuItem icon={<ChatIcon />} onClick={() => setAttachmentDialog("quickReplies")}>
                Quick replies
              </MenuItem>
            </MenuList>
          </Menu>

          <Input
            ref={documentInputRef}
            type="file"
            display="none"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              uploadAttachment(file, "document");
            }}
          />
          <Input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            display="none"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              uploadAttachment(file, "media");
            }}
          />
          <Input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            display="none"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              uploadAttachment(file, "camera");
            }}
          />
          <Input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            display="none"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              uploadAttachment(file, "audio");
            }}
          />

          <Input
            ref={messageInputRef}
            placeholder="Type a message..."
            value={newMessage}
            onChange={
              handleMessageTyping
            }
            onKeyDown={handleKeyDown}
            disabled={sending}
            autoComplete="off"
          />

          <IconButton
            type="button"
            aria-label="Send message"
            title="Send message"
            icon={<ArrowForwardIcon />}
            onClick={() => sendMessage()}
            isLoading={sending}
            isDisabled={!newMessage.trim() || uploadingAttachment}
            width="48px"
            minWidth="48px"
            height="48px"
            borderRadius="full"
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            _disabled={{
              bg: "gray.300",
              color: "white",
              opacity: 1,
            }}
          />
        </Flex>

        <Modal
          isOpen={Boolean(attachmentDialog)}
          onClose={() => setAttachmentDialog(null)}
          isCentered
          size={attachmentDialog === "sticker" || attachmentDialog === "quickReplies" ? "sm" : "md"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {attachmentDialog === "poll"
                ? "Create poll"
                : attachmentDialog === "event"
                  ? "Create event"
                  : attachmentDialog === "catalogue"
                    ? "Share catalogue item"
                    : attachmentDialog === "sticker"
                      ? "Choose a sticker"
                      : "Quick replies"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {attachmentDialog === "poll" && (
                <Flex direction="column" gap={3}>
                  <Input
                    placeholder="Ask a question"
                    value={pollQuestion}
                    onChange={(event) => setPollQuestion(event.target.value)}
                  />
                  {pollOptions.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(event) =>
                        setPollOptions((current) =>
                          current.map((value, optionIndex) =>
                            optionIndex === index ? event.target.value : value
                          )
                        )
                      }
                    />
                  ))}
                  {pollOptions.length < 5 && (
                    <Button
                      variant="ghost"
                      alignSelf="flex-start"
                      onClick={() => setPollOptions((current) => [...current, ""])}
                    >
                      Add option
                    </Button>
                  )}
                </Flex>
              )}

              {attachmentDialog === "event" && (
                <Flex direction="column" gap={3}>
                  <Input
                    placeholder="Event title"
                    value={eventTitle}
                    onChange={(event) => setEventTitle(event.target.value)}
                  />
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                  />
                  <Textarea
                    placeholder="Details (optional)"
                    value={eventDescription}
                    onChange={(event) => setEventDescription(event.target.value)}
                  />
                </Flex>
              )}

              {attachmentDialog === "catalogue" && (
                <Flex direction="column" gap={3}>
                  <Input
                    placeholder="Product or service name"
                    value={catalogueName}
                    onChange={(event) => setCatalogueName(event.target.value)}
                  />
                  <Input
                    placeholder="Price (optional)"
                    value={cataloguePrice}
                    onChange={(event) => setCataloguePrice(event.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={catalogueDescription}
                    onChange={(event) => setCatalogueDescription(event.target.value)}
                  />
                  <Input
                    placeholder="Image URL (optional)"
                    value={catalogueImageUrl}
                    onChange={(event) => setCatalogueImageUrl(event.target.value)}
                  />
                </Flex>
              )}

              {attachmentDialog === "sticker" && (
                <Flex wrap="wrap" gap={2} justifyContent="center">
                  {["✨", "🎉", "💛", "🌟", "😂", "🙌", "🌈", "🫶"].map((sticker) => (
                    <Button
                      key={sticker}
                      fontSize="2xl"
                      variant="ghost"
                      onClick={() => {
                        sendMessage({
                          kind: "sticker",
                          content: sticker,
                          payload: { sticker },
                        });
                        setAttachmentDialog(null);
                      }}
                    >
                      {sticker}
                    </Button>
                  ))}
                </Flex>
              )}

              {attachmentDialog === "quickReplies" && (
                <Flex direction="column" gap={2}>
                  {["Thanks!", "I’ll get back to you.", "On my way.", "Can we talk later?"].map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      justifyContent="flex-start"
                      onClick={() => {
                        sendMessage({ content: reply });
                        setAttachmentDialog(null);
                      }}
                    >
                      {reply}
                    </Button>
                  ))}
                </Flex>
              )}
            </ModalBody>

            {["poll", "event", "catalogue"].includes(attachmentDialog) && (
              <ModalFooter>
                <Button mr={3} variant="ghost" onClick={() => setAttachmentDialog(null)}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={submitAttachmentDialog}>
                  Send
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default SingleChats;

