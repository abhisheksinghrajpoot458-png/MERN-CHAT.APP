

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const http = require("http");
// const mongoose = require("mongoose");
// const { Server } = require("socket.io");

// dotenv.config();

// const connectDB = require("./config/db");

// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");

// const Chat = require("./Models/chatModel");
// const Message = require("./Models/messageModel");
// const User = require("./Models/userModel");

// const {
//     notFound,
//     errorHandler,
// } = require("./middleware/errorMiddleware");

// // ======================================================
// // EXPRESS APP
// // ======================================================

// const app = express();

// // ======================================================
// // HTTP SERVER
// // ======================================================

// const server = http.createServer(app);

// // ======================================================
// // SOCKET.IO SERVER
// // ======================================================

// const io = new Server(server, {
//     pingTimeout: 60000,

//     cors: {
//         origin: "http://localhost:3000",
//         methods: [
//             "GET",
//             "POST",
//             "PUT",
//             "PATCH",
//             "DELETE",
//         ],
//         credentials: true,
//     },
// });

// // ======================================================
// // MAKE SOCKET.IO AVAILABLE IN CONTROLLERS
// // ======================================================

// app.set("io", io);

// const getChatContactIds = async (userId) => {
//     const chats = await Chat.find({ users: userId })
//         .select("users")
//         .lean();

//     return [
//         ...new Set(
//             chats
//                 .flatMap((chat) => chat.users || [])
//                 .map((chatUserId) => chatUserId.toString())
//                 .filter((chatUserId) => chatUserId !== userId)
//         ),
//     ];
// };

// const getChatPresenceSnapshot = async (userId) => {
//     const contactIds = await getChatContactIds(userId);

//     if (contactIds.length === 0) {
//         return [];
//     }

//     const users = await User.find({ _id: { $in: contactIds } })
//         .select("_id isOnline lastSeen")
//         .lean();

//     return users.map((user) => ({
//         userId: user._id.toString(),
//         isOnline: Boolean(user.isOnline),
//         lastSeen: user.lastSeen || null,
//     }));
// };

// const broadcastPresence = async (user) => {
//     const userId = user._id.toString();
//     const contactIds = await getChatContactIds(userId);

//     if (contactIds.length > 0) {
//         io.to(contactIds).emit("presence update", {
//             userId,
//             isOnline: Boolean(user.isOnline),
//             lastSeen: user.lastSeen || null,
//         });
//     }
// };

// // ======================================================
// // MIDDLEWARE
// // ======================================================

// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         credentials: true,
//         methods: [
//             "GET",
//             "POST",
//             "PUT",
//             "PATCH",
//             "DELETE",
//             "OPTIONS",
//         ],
//     })
// );

// app.use(express.json());

// // ======================================================
// // TEST ROUTE
// // ======================================================

// app.get("/", (req, res) => {
//     res.json({
//         message: "API is running...",
//         socket: "Socket.IO is running...",
//     });
// });

// // ======================================================
// // API ROUTES
// // ======================================================

// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

// // ======================================================
// // SOCKET.IO CONNECTION
// // ======================================================

// io.on("connection", (socket) => {
//     console.log("");
//     console.log("=================================");
//     console.log("🔌 Socket connected:", socket.id);
//     console.log("=================================");
//     console.log("");

//     // ==================================================
//     // SETUP USER
//     // ==================================================

//     socket.on("setup", async (user) => {
//         try {
//             if (
//                 !user?._id ||
//                 !mongoose.isValidObjectId(user._id)
//             ) {
//                 console.log(
//                     "❌ Invalid user received in setup"
//                 );
//                 return;
//             }

//             const userId = user._id.toString();
//             const onlineUser = await User.findByIdAndUpdate(
//                 userId,
//                 { $set: { isOnline: true } },
//                 { returnDocument: "after" }
//             ).select("_id isOnline lastSeen");

//             if (!onlineUser) {
//                 return;
//             }

//             // Join personal room
//             socket.join(userId);

//             // Save user ID on socket
//             socket.userId = userId;

//             console.log(
//                 `✅ User ${
//                     user.name || userId
//                 } joined personal room ${userId}`
//             );

//             socket.emit(
//                 "presence snapshot",
//                 await getChatPresenceSnapshot(userId)
//             );

//             await broadcastPresence(onlineUser);

//             // Send connected event
//             socket.emit("connected");

//         } catch (error) {
//             console.error(
//                 "❌ Setup socket error:",
//                 error.message
//             );
//         }
//     });

//     // ==================================================
//     // JOIN CHAT
//     // ==================================================

//     const joinChatRoom = (chatId) => {
//         try {
//             if (!chatId) {
//                 return;
//             }

//             const roomId = chatId.toString();

//             socket.join(roomId);

//             console.log(
//                 `👥 Socket ${socket.id} joined chat room ${roomId}`
//             );

//         } catch (error) {
//             console.error(
//                 "❌ Join chat error:",
//                 error.message
//             );
//         }
//     };

//     socket.on("join chat", joinChatRoom);
//     socket.on("join_chat", joinChatRoom);

//     // ==================================================
//     // LEAVE CHAT
//     // ==================================================

//     socket.on("leave chat", (chatId) => {
//         try {
//             if (!chatId) {
//                 return;
//             }

//             const roomId = chatId.toString();

//             socket.leave(roomId);

//             console.log(
//                 `🚪 Socket ${socket.id} left chat room ${roomId}`
//             );

//         } catch (error) {
//             console.error(
//                 "❌ Leave chat error:",
//                 error.message
//             );
//         }
//     });

//     // ==================================================
//     // NEW MESSAGE
//     // ==================================================

//     socket.on(
//         "new message",
//         async (clientMessage) => {
//             try {
//                 console.log("");
//                 console.log(
//                     "📩 NEW MESSAGE SOCKET EVENT"
//                 );

//                 // ------------------------------------------
//                 // Check socket user
//                 // ------------------------------------------

//                 if (!socket.userId) {
//                     console.log(
//                         "❌ Socket user not found"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Check message
//                 // ------------------------------------------

//                 if (
//                     !clientMessage ||
//                     !clientMessage._id
//                 ) {
//                     console.log(
//                         "❌ Message ID missing"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Validate message ObjectId
//                 // ------------------------------------------

//                 if (
//                     !mongoose.isValidObjectId(
//                         clientMessage._id
//                     )
//                 ) {
//                     console.log(
//                         "❌ Invalid message ID:",
//                         clientMessage._id
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Find message in MongoDB
//                 // ------------------------------------------

//                 const message =
//                     await Message.findById(
//                         clientMessage._id
//                     )
//                         .populate(
//                             "sender",
//                             "name pic email"
//                         )
//                         .populate({
//                             path: "replyTo",
//                             select:
//                                 "content sender createdAt",
//                             populate: {
//                                 path: "sender",
//                                 select:
//                                     "name pic email",
//                             },
//                         })
//                         .populate({
//                             path: "chat",
//                             populate: {
//                                 path: "users",
//                                 select:
//                                     "name pic email",
//                             },
//                         });

//                 // ------------------------------------------
//                 // Message not found
//                 // ------------------------------------------

//                 if (!message) {
//                     console.log(
//                         "❌ Message not found in database"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Sender check
//                 // ------------------------------------------

//                 if (!message.sender) {
//                     console.log(
//                         "❌ Message sender not found"
//                     );
//                     return;
//                 }

//                 const senderId =
//                     message.sender._id.toString();

//                 // ------------------------------------------
//                 // Verify socket user
//                 // ------------------------------------------

//                 if (
//                     senderId !==
//                     socket.userId.toString()
//                 ) {
//                     console.log(
//                         "❌ Socket user is not message sender"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Chat check
//                 // ------------------------------------------

//                 if (!message.chat) {
//                     console.log(
//                         "❌ Message chat not found"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Chat users check
//                 // ------------------------------------------

//                 if (
//                     !Array.isArray(
//                         message.chat.users
//                     )
//                 ) {
//                     console.log(
//                         "❌ Chat users not found"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Check sender is chat member
//                 // ------------------------------------------

//                 const isChatMember =
//                     message.chat.users.some(
//                         (chatUser) => {
//                             const chatUserId =
//                                 chatUser?._id?.toString();

//                             return (
//                                 chatUserId ===
//                                 senderId
//                             );
//                         }
//                     );

//                 if (!isChatMember) {
//                     console.log(
//                         "❌ Sender is not a member of this chat"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Convert to normal object
//                 // ------------------------------------------

//                 const messagePayload =
//                     message.toObject();

//                 const chatId =
//                     message.chat._id.toString();

//                 console.log(
//                     "✅ Message:",
//                     messagePayload.content
//                 );

//                 console.log(
//                     "👤 Sender:",
//                     messagePayload.sender?.name
//                 );

//                 console.log(
//                     "💬 Chat:",
//                     chatId
//                 );

//                 // ==================================================
//                 // BROADCAST MESSAGE
//                 // ==================================================

//                 /*
//                     We send the message to:

//                     1. Chat room
//                     2. Personal rooms of chat members

//                     Sender is excluded from chat-room delivery
//                     because sender already has the message.
//                 */

//                 let broadcast =
//                     io
//                         .to(chatId)
//                         .except(senderId);

//                 message.chat.users.forEach(
//                     (chatUser) => {
//                         const recipientId =
//                             chatUser?._id?.toString();

//                         if (
//                             recipientId &&
//                             recipientId !== senderId
//                         ) {
//                             broadcast =
//                                 broadcast.to(
//                                     recipientId
//                                 );
//                         }
//                     }
//                 );

//                 broadcast.emit(
//                     "message received",
//                     messagePayload
//                 );

//                 console.log(
//                     "✅ Message broadcast completed"
//                 );

//                 console.log("");

//             } catch (error) {
//                 console.error(
//                     "❌ Socket new message error:",
//                     error
//                 );
//             }
//         }
//     );

//     // ==================================================
//     // TYPING
//     // ==================================================

//     socket.on(
//         "typing",
//         (data) => {
//             try {
//                 /*
//                     Supported formats:

//                     socket.emit("typing", chatId)

//                     OR

//                     socket.emit("typing", {
//                         chatId,
//                         userId
//                     })
//                 */

//                 const chatId =
//                     typeof data === "object"
//                         ? data?.chatId
//                         : data;

//                 if (!chatId) {
//                     return;
//                 }

//                 const roomId =
//                     chatId.toString();

//                 /*
//                     socket.in(roomId)

//                     means sender will NOT receive
//                     his/her own typing event.
//                 */

//                 socket
//                     .in(roomId)
//                     .emit(
//                         "typing",
//                         {
//                             chatId: roomId,
//                             userId:
//                                 socket.userId,
//                         }
//                     );

//             } catch (error) {
//                 console.error(
//                     "❌ Typing socket error:",
//                     error.message
//                 );
//             }
//         }
//     );

//     // ==================================================
//     // STOP TYPING
//     // ==================================================

//     socket.on(
//         "stop typing",
//         (data) => {
//             try {
//                 const chatId =
//                     typeof data === "object"
//                         ? data?.chatId
//                         : data;

//                 if (!chatId) {
//                     return;
//                 }

//                 const roomId =
//                     chatId.toString();

//                 socket
//                     .in(roomId)
//                     .emit(
//                         "stop typing",
//                         {
//                             chatId: roomId,
//                             userId:
//                                 socket.userId,
//                         }
//                     );

//             } catch (error) {
//                 console.error(
//                     "❌ Stop typing socket error:",
//                     error.message
//                 );
//             }
//         }
//     );

//     // ==================================================
//     // MESSAGE REACTION
//     // ==================================================

//     socket.on(
//         "message reaction",
//         (message) => {
//             try {
//                 if (!message) {
//                     return;
//                 }

//                 const chat =
//                     message?.chat;

//                 if (
//                     !chat ||
//                     !Array.isArray(
//                         chat.users
//                     )
//                 ) {
//                     console.log(
//                         "❌ Reaction chat/users missing"
//                     );
//                     return;
//                 }

//                 // ------------------------------------------
//                 // Send reaction to all chat members
//                 // ------------------------------------------

//                 chat.users.forEach(
//                     (chatUser) => {
//                         const userId =
//                             typeof chatUser ===
//                             "object"
//                                 ? chatUser?._id
//                                 : chatUser;

//                         if (!userId) {
//                             return;
//                         }

//                         const userRoom =
//                             userId.toString();

//                         /*
//                             Sender also receives the event.

//                             This is okay because frontend
//                             replaces the existing message
//                             instead of adding another copy.
//                         */

//                         io
//                             .to(userRoom)
//                             .emit(
//                                 "message reaction",
//                                 message
//                             );
//                     }
//                 );

//                 console.log(
//                     `❤️ Reaction broadcast for message ${
//                         message._id || ""
//                     }`
//                 );

//             } catch (error) {
//                 console.error(
//                     "❌ Reaction socket error:",
//                     error.message
//                 );
//             }
//         }
//     );

//     // ==================================================
//     // MESSAGE DELETED
//     // ==================================================

//     socket.on(
//         "message deleted",
//         (data) => {
//             try {
//                 if (
//                     !data ||
//                     !data.messageId ||
//                     !data.chatId
//                 ) {
//                     console.log(
//                         "❌ Invalid delete event"
//                     );
//                     return;
//                 }

//                 const chatId =
//                     data.chatId.toString();

//                 const messageId =
//                     data.messageId.toString();

//                 /*
//                     socket.in(chatId)

//                     sends to everyone in chat
//                     except the sender.
//                 */

//                 socket
//                     .in(chatId)
//                     .emit(
//                         "message deleted",
//                         {
//                             messageId,
//                             chatId,
//                         }
//                     );

//                 console.log(
//                     `🗑️ Message deleted: ${messageId}`
//                 );

//             } catch (error) {
//                 console.error(
//                     "❌ Delete socket error:",
//                     error.message
//                 );
//             }
//         }
//     );

//     // ==================================================
//     // MESSAGE UPDATED
//     // ==================================================

//     socket.on(
//         "message updated",
//         (message) => {
//             try {
//                 if (!message) {
//                     return;
//                 }

//                 const chat =
//                     message?.chat;

//                 if (
//                     !chat ||
//                     !Array.isArray(
//                         chat.users
//                     )
//                 ) {
//                     return;
//                 }

//                 chat.users.forEach(
//                     (chatUser) => {
//                         const userId =
//                             typeof chatUser ===
//                             "object"
//                                 ? chatUser?._id
//                                 : chatUser;

//                         if (!userId) {
//                             return;
//                         }

//                         io
//                             .to(
//                                 userId.toString()
//                             )
//                             .emit(
//                                 "message updated",
//                                 message
//                             );
//                     }
//                 );

//                 console.log(
//                     `✏️ Message updated: ${
//                         message._id || ""
//                     }`
//                 );

//             } catch (error) {
//                 console.error(
//                     "❌ Message update socket error:",
//                     error.message
//                 );
//             }
//         }
//     );

//     // ==================================================
//     // DISCONNECT
//     // ==================================================

//     socket.on(
//         "disconnect",
//         async (reason) => {
//             console.log("");
//             console.log(
//                 "================================="
//             );

//             console.log(
//                 `🔌 Socket disconnected: ${socket.id}`
//             );

//             console.log(
//                 `👤 User: ${
//                     socket.userId || "Unknown"
//                 }`
//             );

//             console.log(
//                 `Reason: ${reason}`
//             );

//             console.log(
//                 "================================="
//             );

//             console.log("");

//             try {
//                 const userId = socket.userId?.toString();

//                 if (!userId) {
//                     return;
//                 }

//                 const remainingSockets = await io
//                     .in(userId)
//                     .fetchSockets();
//                 const hasOtherConnection = remainingSockets.some(
//                     (connectedSocket) => connectedSocket.id !== socket.id
//                 );

//                 if (hasOtherConnection) {
//                     return;
//                 }

//                 const offlineUser = await User.findByIdAndUpdate(
//                     userId,
//                     {
//                         $set: {
//                             isOnline: false,
//                             lastSeen: new Date(),
//                         },
//                     },
//                     { returnDocument: "after" }
//                 ).select("_id isOnline lastSeen");

//                 if (offlineUser) {
//                     await broadcastPresence(offlineUser);
//                 }
//             } catch (error) {
//                 console.error(
//                     "❌ Last-seen update failed:",
//                     error.message
//                 );
//             }
//         }
//     );
// });

// // ======================================================
// // ERROR HANDLING
// // ======================================================

// app.use(notFound);
// app.use(errorHandler);

// // ======================================================
// // START SERVER
// // ======================================================

// const PORT =
//     process.env.PORT || 5000;

// const startServer = async () => {
//     try {
//         // ----------------------------------------------
//         // Connect MongoDB
//         // ----------------------------------------------

//         await connectDB();

//         // ----------------------------------------------
//         // Start HTTP + Socket.IO server
//         // ----------------------------------------------

//         server.listen(
//             PORT,
//             () => {
//                 console.log("");
//                 console.log(
//                     "================================="
//                 );

//                 console.log(
//                     `🚀 Server running on PORT ${PORT}`
//                 );

//                 console.log(
//                     `🔌 Socket.IO running on http://localhost:${PORT}`
//                 );

//                 console.log(
//                     "📡 Real-time messaging enabled"
//                 );

//                 console.log(
//                     "💬 Chat rooms enabled"
//                 );

//                 console.log(
//                     "⌨️ Typing indicator enabled"
//                 );

//                 console.log(
//                     "❤️ Message reactions enabled"
//                 );

//                 console.log(
//                     "🗑️ Message delete events enabled"
//                 );

//                 console.log(
//                     "✏️ Message update events enabled"
//                 );

//                 console.log(
//                     "================================="
//                 );

//                 console.log("");
//             }
//         );

//     } catch (error) {
//         console.error(
//             "❌ Server startup failed:",
//             error.message
//         );

//         process.exit(1);
//     }
// };

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const Chat = require("./Models/chatModel");
const Message = require("./Models/messageModel");
const User = require("./Models/userModel");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// HTTP SERVER
// ======================================================

const server = http.createServer(app);

// ======================================================
// CORS CONFIGURATION
// ======================================================

// IMPORTANT:
// Add your actual Netlify URL in Render environment variables:
//
// FRONTEND_URL=https://your-site.netlify.app
//
// You can also put multiple URLs separated by commas.

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

// ======================================================
// EXPRESS CORS
// ======================================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

// ======================================================
// HTTP SERVER
// ======================================================

// ======================================================
// SOCKET.IO SERVER
// ======================================================

const io = new Server(server, {
  pingTimeout: 60000,

  cors: {
    origin: allowedOrigins,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],

    credentials: true,
  },
});

// ======================================================
// MAKE SOCKET.IO AVAILABLE IN CONTROLLERS
// ======================================================

app.set("io", io);

// ======================================================
// CHAT CONTACT IDS
// ======================================================

const getChatContactIds = async (userId) => {
  const chats = await Chat.find({ users: userId })
    .select("users")
    .lean();

  return [
    ...new Set(
      chats
        .flatMap((chat) => chat.users || [])
        .map((chatUserId) =>
          chatUserId.toString()
        )
        .filter(
          (chatUserId) =>
            chatUserId !== userId
        )
    ),
  ];
};

// ======================================================
// CHAT PRESENCE SNAPSHOT
// ======================================================

const getChatPresenceSnapshot = async (userId) => {
  const contactIds =
    await getChatContactIds(userId);

  if (contactIds.length === 0) {
    return [];
  }

  const users = await User.find({
    _id: { $in: contactIds },
  })
    .select("_id isOnline lastSeen")
    .lean();

  return users.map((user) => ({
    userId: user._id.toString(),
    isOnline: Boolean(user.isOnline),
    lastSeen: user.lastSeen || null,
  }));
};

// ======================================================
// BROADCAST PRESENCE
// ======================================================

const broadcastPresence = async (user) => {
  const userId = user._id.toString();

  const contactIds =
    await getChatContactIds(userId);

  if (contactIds.length > 0) {
    io.to(contactIds).emit(
      "presence update",
      {
        userId,
        isOnline: Boolean(user.isOnline),
        lastSeen: user.lastSeen || null,
      }
    );
  }
};

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "API is running...",
    socket: "Socket.IO is running...",
    environment:
      process.env.NODE_ENV || "production",
  });
});

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ======================================================
// SOCKET.IO CONNECTION
// ======================================================

io.on("connection", (socket) => {
  console.log("");
  console.log(
    "================================="
  );
  console.log(
    "🔌 Socket connected:",
    socket.id
  );
  console.log(
    "================================="
  );
  console.log("");

  // ==================================================
  // SETUP USER
  // ==================================================

  socket.on("setup", async (user) => {
    try {
      if (
        !user?._id ||
        !mongoose.isValidObjectId(user._id)
      ) {
        console.log(
          "❌ Invalid user received in setup"
        );
        return;
      }

      const userId = user._id.toString();

      const onlineUser =
        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              isOnline: true,
            },
          },
          {
            returnDocument: "after",
          }
        ).select(
          "_id isOnline lastSeen"
        );

      if (!onlineUser) {
        return;
      }

      // Join personal room
      socket.join(userId);

      // Save user ID on socket
      socket.userId = userId;

      console.log(
        `✅ User ${
          user.name || userId
        } joined personal room ${userId}`
      );

      socket.emit(
        "presence snapshot",
        await getChatPresenceSnapshot(
          userId
        )
      );

      await broadcastPresence(
        onlineUser
      );

      // Send connected event
      socket.emit("connected");
    } catch (error) {
      console.error(
        "❌ Setup socket error:",
        error.message
      );
    }
  });

  // ==================================================
  // JOIN CHAT
  // ==================================================

  const joinChatRoom = (chatId) => {
    try {
      if (!chatId) {
        return;
      }

      const roomId = chatId.toString();

      socket.join(roomId);

      console.log(
        `👥 Socket ${socket.id} joined chat room ${roomId}`
      );
    } catch (error) {
      console.error(
        "❌ Join chat error:",
        error.message
      );
    }
  };

  socket.on(
    "join chat",
    joinChatRoom
  );

  socket.on(
    "join_chat",
    joinChatRoom
  );

  // ==================================================
  // LEAVE CHAT
  // ==================================================

  socket.on(
    "leave chat",
    (chatId) => {
      try {
        if (!chatId) {
          return;
        }

        const roomId =
          chatId.toString();

        socket.leave(roomId);

        console.log(
          `🚪 Socket ${socket.id} left chat room ${roomId}`
        );
      } catch (error) {
        console.error(
          "❌ Leave chat error:",
          error.message
        );
      }
    }
  );

  // ==================================================
  // NEW MESSAGE
  // ==================================================

  socket.on(
    "new message",
    async (clientMessage) => {
      try {
        console.log("");
        console.log(
          "📩 NEW MESSAGE SOCKET EVENT"
        );

        if (!socket.userId) {
          console.log(
            "❌ Socket user not found"
          );
          return;
        }

        if (
          !clientMessage ||
          !clientMessage._id
        ) {
          console.log(
            "❌ Message ID missing"
          );
          return;
        }

        if (
          !mongoose.isValidObjectId(
            clientMessage._id
          )
        ) {
          console.log(
            "❌ Invalid message ID:",
            clientMessage._id
          );
          return;
        }

        const message =
          await Message.findById(
            clientMessage._id
          )
            .populate(
              "sender",
              "name pic email"
            )
            .populate({
              path: "replyTo",
              select:
                "content sender createdAt",
              populate: {
                path: "sender",
                select:
                  "name pic email",
              },
            })
            .populate({
              path: "chat",
              populate: {
                path: "users",
                select:
                  "name pic email",
              },
            });

        if (!message) {
          console.log(
            "❌ Message not found in database"
          );
          return;
        }

        if (!message.sender) {
          console.log(
            "❌ Message sender not found"
          );
          return;
        }

        const senderId =
          message.sender._id.toString();

        if (
          senderId !==
          socket.userId.toString()
        ) {
          console.log(
            "❌ Socket user is not message sender"
          );
          return;
        }

        if (!message.chat) {
          console.log(
            "❌ Message chat not found"
          );
          return;
        }

        if (
          !Array.isArray(
            message.chat.users
          )
        ) {
          console.log(
            "❌ Chat users not found"
          );
          return;
        }

        const isChatMember =
          message.chat.users.some(
            (chatUser) => {
              const chatUserId =
                chatUser?._id?.toString();

              return (
                chatUserId ===
                senderId
              );
            }
          );

        if (!isChatMember) {
          console.log(
            "❌ Sender is not a member of this chat"
          );
          return;
        }

        const messagePayload =
          message.toObject();

        const chatId =
          message.chat._id.toString();

        console.log(
          "✅ Message:",
          messagePayload.content
        );

        console.log(
          "👤 Sender:",
          messagePayload.sender?.name
        );

        console.log(
          "💬 Chat:",
          chatId
        );

        let broadcast =
          io
            .to(chatId)
            .except(senderId);

        message.chat.users.forEach(
          (chatUser) => {
            const recipientId =
              chatUser?._id?.toString();

            if (
              recipientId &&
              recipientId !== senderId
            ) {
              broadcast =
                broadcast.to(
                  recipientId
                );
            }
          }
        );

        broadcast.emit(
          "message received",
          messagePayload
        );

        console.log(
          "✅ Message broadcast completed"
        );

        console.log("");
      } catch (error) {
        console.error(
          "❌ Socket new message error:",
          error
        );
      }
    }
  );

  // ==================================================
  // TYPING
  // ==================================================

  socket.on(
    "typing",
    (data) => {
      try {
        const chatId =
          typeof data === "object"
            ? data?.chatId
            : data;

        if (!chatId) {
          return;
        }

        const roomId =
          chatId.toString();

        socket
          .in(roomId)
          .emit(
            "typing",
            {
              chatId: roomId,
              userId:
                socket.userId,
            }
          );
      } catch (error) {
        console.error(
          "❌ Typing socket error:",
          error.message
        );
      }
    }
  );

  // ==================================================
  // STOP TYPING
  // ==================================================

  socket.on(
    "stop typing",
    (data) => {
      try {
        const chatId =
          typeof data === "object"
            ? data?.chatId
            : data;

        if (!chatId) {
          return;
        }

        const roomId =
          chatId.toString();

        socket
          .in(roomId)
          .emit(
            "stop typing",
            {
              chatId: roomId,
              userId:
                socket.userId,
            }
          );
      } catch (error) {
        console.error(
          "❌ Stop typing socket error:",
          error.message
        );
      }
    }
  );

  // ==================================================
  // MESSAGE REACTION
  // ==================================================

  socket.on(
    "message reaction",
    (message) => {
      try {
        if (!message) {
          return;
        }

        const chat =
          message?.chat;

        if (
          !chat ||
          !Array.isArray(
            chat.users
          )
        ) {
          console.log(
            "❌ Reaction chat/users missing"
          );
          return;
        }

        chat.users.forEach(
          (chatUser) => {
            const userId =
              typeof chatUser ===
              "object"
                ? chatUser?._id
                : chatUser;

            if (!userId) {
              return;
            }

            io.to(
              userId.toString()
            ).emit(
              "message reaction",
              message
            );
          }
        );

        console.log(
          `❤️ Reaction broadcast for message ${
            message._id || ""
          }`
        );
      } catch (error) {
        console.error(
          "❌ Reaction socket error:",
          error.message
        );
      }
    }
  );

  // ==================================================
  // MESSAGE DELETED
  // ==================================================

  socket.on(
    "message deleted",
    (data) => {
      try {
        if (
          !data ||
          !data.messageId ||
          !data.chatId
        ) {
          console.log(
            "❌ Invalid delete event"
          );
          return;
        }

        const chatId =
          data.chatId.toString();

        const messageId =
          data.messageId.toString();

        socket
          .in(chatId)
          .emit(
            "message deleted",
            {
              messageId,
              chatId,
            }
          );

        console.log(
          `🗑️ Message deleted: ${messageId}`
        );
      } catch (error) {
        console.error(
          "❌ Delete socket error:",
          error.message
        );
      }
    }
  );

  // ==================================================
  // MESSAGE UPDATED
  // ==================================================

  socket.on(
    "message updated",
    (message) => {
      try {
        if (!message) {
          return;
        }

        const chat =
          message?.chat;

        if (
          !chat ||
          !Array.isArray(
            chat.users
          )
        ) {
          return;
        }

        chat.users.forEach(
          (chatUser) => {
            const userId =
              typeof chatUser ===
              "object"
                ? chatUser?._id
                : chatUser;

            if (!userId) {
              return;
            }

            io
              .to(
                userId.toString()
              )
              .emit(
                "message updated",
                message
              );
          }
        );

        console.log(
          `✏️ Message updated: ${
            message._id || ""
          }`
        );
      } catch (error) {
        console.error(
          "❌ Message update socket error:",
          error.message
        );
      }
    }
  );

  // ==================================================
  // DISCONNECT
  // ==================================================

  socket.on(
    "disconnect",
    async (reason) => {
      console.log("");
      console.log(
        "================================="
      );

      console.log(
        `🔌 Socket disconnected: ${socket.id}`
      );

      console.log(
        `👤 User: ${
          socket.userId ||
          "Unknown"
        }`
      );

      console.log(
        `Reason: ${reason}`
      );

      console.log(
        "================================="
      );

      console.log("");

      try {
        const userId =
          socket.userId?.toString();

        if (!userId) {
          return;
        }

        const remainingSockets =
          await io
            .in(userId)
            .fetchSockets();

        const hasOtherConnection =
          remainingSockets.some(
            (connectedSocket) =>
              connectedSocket.id !==
              socket.id
          );

        if (
          hasOtherConnection
        ) {
          return;
        }

        const offlineUser =
          await User.findByIdAndUpdate(
            userId,
            {
              $set: {
                isOnline: false,
                lastSeen:
                  new Date(),
              },
            },
            {
              returnDocument:
                "after",
            }
          ).select(
            "_id isOnline lastSeen"
          );

        if (offlineUser) {
          await broadcastPresence(
            offlineUser
          );
        }
      } catch (error) {
        console.error(
          "❌ Last-seen update failed:",
          error.message
        );
      }
    }
  );
});

// ======================================================
// ERROR HANDLING
// ======================================================

app.use(notFound);
app.use(errorHandler);

// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ----------------------------------------------
    // Connect MongoDB
    // ----------------------------------------------

    await connectDB();

    // ----------------------------------------------
    // Start HTTP + Socket.IO server
    // ----------------------------------------------

    server.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "================================="
        );

        console.log(
          `🚀 Server running on PORT ${PORT}`
        );

        console.log(
          `🌐 Frontend URL: ${
            process.env.FRONTEND_URL ||
            "Not configured"
          }`
        );

        console.log(
          "🔌 Socket.IO enabled"
        );

        console.log(
          "📡 Real-time messaging enabled"
        );

        console.log(
          "💬 Chat rooms enabled"
        );

        console.log(
          "⌨️ Typing indicator enabled"
        );

        console.log(
          "❤️ Message reactions enabled"
        );

        console.log(
          "🗑️ Message delete events enabled"
        );

        console.log(
          "✏️ Message update events enabled"
        );

        console.log(
          "================================="
        );

        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

// ======================================================
// RUN SERVER
// ======================================================

startServer();

// // ======================================================
// // RUN SERVER
// // ======================================================

// startServer();
