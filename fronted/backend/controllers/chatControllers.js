// const asyncHandler = require("express-async-handler");
// const Chat = require("../Models/chatModel");
// const User = require("../Models/userModel");

// // ========================================
// // Access / Create One-to-One Chat
// // ========================================
// const accessChat = asyncHandler(async (req, res) => {
//     const { userId } = req.body;

//     if (!userId) {
//         console.log("UserId param not sent with request");

//         return res.status(400).json({
//             message: "UserId is required",
//         });
//     }

//     if (!req.user || !req.user._id) {
//         return res.status(401).json({
//             message: "Not authorized",
//         });
//     }

//     let isChat = await Chat.find({
//         isGroupChat: false,
//         $and: [
//             {
//                 users: {
//                     $elemMatch: {
//                         $eq: req.user._id,
//                     },
//                 },
//             },
//             {
//                 users: {
//                     $elemMatch: {
//                         $eq: userId,
//                     },
//                 },
//             },
//         ],
//     })
//         .populate("users", "-password")
//         .populate("latestMessage");

//     isChat = await User.populate(isChat, {
//         path: "latestMessage.sender",
//         select: "name pic email",
//     });

//     if (isChat.length > 0) {
//         return res.status(200).json(isChat[0]);
//     }

//     const chatData = {
//         chatName: "sender",
//         isGroupChat: false,
//         users: [req.user._id, userId],
//     };

//     const createdChat = await Chat.create(chatData);

//     const fullChat = await Chat.findOne({
//         _id: createdChat._id,
//     }).populate("users", "-password");

//     return res.status(200).json(fullChat);
// });


// // ========================================
// // Fetch All Chats
// // ========================================
// const fetchChats = asyncHandler(async (req, res) => {
//     const results = await Chat.find({
//         users: {
//             $elemMatch: {
//                 $eq: req.user._id,
//             },
//         },
//     })
//         .populate("users", "-password")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 });

//     const populatedResults = await User.populate(results, {
//         path: "latestMessage.sender",
//         select: "name pic email",
//     });

//     return res.status(200).json(populatedResults);
// });


// // ========================================
// // Create Group Chat
// // ========================================
// const createGroupChat = asyncHandler(async (req, res) => {
//     if (!req.body.users || !req.body.name) {
//         return res.status(400).json({
//             message: "Please provide users and name for the group chat",
//         });
//     }

//     let users;

//     try {
//         users = JSON.parse(req.body.users);
//     } catch (error) {
//         return res.status(400).json({
//             message: "Invalid users format",
//         });
//     }

//     if (users.length < 2) {
//         return res.status(400).json({
//             message: "A group chat requires at least 3 users",
//         });
//     }

//     // Add logged-in user
//     users.push(req.user._id);

//     try {
//         const groupChat = await Chat.create({
//             chatName: req.body.name,
//             users: users,
//             isGroupChat: true,
//             groupAdmin: req.user._id,
//         });

//         const fullGroupChat = await Chat.findOne({
//             _id: groupChat._id,
//         })
//             .populate("users", "-password")
//             .populate("groupAdmin", "-password");

//         return res.status(200).json(fullGroupChat);

//     } catch (error) {
//         return res.status(400).json({
//             message: error.message,
//         });
//     }
// });


// // ========================================
// // Rename Group
// // ========================================
// const renameGroup = asyncHandler(async (req, res) => {
//     const { chatId, chatName } = req.body;

//     if (!chatId || !chatName) {
//         return res.status(400).json({
//             message: "Chat ID and chat name are required",
//         });
//     }

//     const updatedChat = await Chat.findByIdAndUpdate(
//         chatId,
//         {
//             chatName: chatName,
//         },
//         {
//             new: true,
//         }
//     )
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//     if (!updatedChat) {
//         return res.status(404).json({
//             message: "Chat Not Found",
//         });
//     }

//     return res.status(200).json(updatedChat);
// });


// // ========================================
// // Export Controllers
// // ========================================

// const addToGroup = asyncHandler(async (req, res) => {
//     const { chatId, userId } = req.body;
//     const added = Chat.findByIdAndUpdate(
//         chatId,
//         { $push: { users: userId } },
//         { new: true }
//     )
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");
//     if (!added) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     }else{
//         res.json(added);

//     }
//     const removeFromGroup = asyncHandler(async (req, res) => {
//     const { chatId, userId } = req.body;
//     const removed = Chat.findByIdAndUpdate(
//         chatId,
//         { $pull: { users: userId } },
//         { new: true }
//     )
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");
//     if (!removed) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     }else{
//         res.json(removed);
//     }
// module.exports = {
//     accessChat,
//     fetchChats,
//     createGroupChat,
//     renameGroup,addToGroup,removeFromGroup,
// };



const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

// ========================================
// Access / Create One-to-One Chat
// ========================================
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            message: "UserId is required",
        });
    }

    if (!req.user || !req.user._id) {
        return res.status(401).json({
            message: "Not authorized",
        });
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: {
                    $elemMatch: {
                        $eq: req.user._id,
                    },
                },
            },
            {
                users: {
                    $elemMatch: {
                        $eq: userId,
                    },
                },
            },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        return res.status(200).json(isChat[0]);
    }

    const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({
        _id: createdChat._id,
    }).populate("users", "-password");

    return res.status(200).json(fullChat);
});


// ========================================
// Fetch All Chats
// ========================================
const fetchChats = asyncHandler(async (req, res) => {
    const results = await Chat.find({
        users: {
            $elemMatch: {
                $eq: req.user._id,
            },
        },
    })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    return res.status(200).json(populatedResults);
});


// ========================================
// Create Group Chat
// ========================================
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({
            message: "Please provide users and name for the group chat",
        });
    }

    let users;

    try {
        users = JSON.parse(req.body.users);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid users format",
        });
    }

    if (users.length < 2) {
        return res.status(400).json({
            message: "A group chat requires at least 3 users",
        });
    }

    // Add logged-in user
    users.push(req.user._id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id,
        });

        const fullGroupChat = await Chat.findOne({
            _id: groupChat._id,
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return res.status(200).json(fullGroupChat);

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
});


// ========================================
// Rename Group
// ========================================
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
        return res.status(400).json({
            message: "Chat ID and chat name are required",
        });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return res.status(404).json({
            message: "Chat Not Found",
        });
    }

    return res.status(200).json(updatedChat);
});


// ========================================
// Add User To Group
// ========================================
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({
            message: "Chat ID and User ID are required",
        });
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {
                users: userId,
            },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        return res.status(404).json({
            message: "Chat Not Found",
        });
    }

    return res.status(200).json(added);
});


// ========================================
// Remove User From Group
// ========================================
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({
            message: "Chat ID and User ID are required",
        });
    }

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {
                users: userId,
            },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        return res.status(404).json({
            message: "Chat Not Found",
        });
    }

    return res.status(200).json(removed);
});


// ========================================
// Export Controllers
// ========================================
module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};