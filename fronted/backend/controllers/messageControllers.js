const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");

const allowedReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const allMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    const isMember = chat.users.some(
        (chatUserId) => chatUserId.toString() === req.user._id.toString()
    );

    if (!isMember) {
        return res.status(403).json({ message: "Not authorized to view this chat" });
    }

    const messages = await Message.find({
        chat: chatId,
        deletedFor: { $ne: req.user._id },
    })
        .populate("sender", "name pic email")
        .populate("reactions.user", "name pic")
        .populate({
            path: "replyTo",
            select: "content sender",
            populate: { path: "sender", select: "name" },
        })
        .populate("chat")
        .sort({ createdAt: 1 });

    return res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
    const {
        content,
        chatId,
        replyTo,
        kind = "text",
        payload = null,
    } = req.body;

    const supportedKinds = ["text", "file", "contact", "poll", "event", "sticker", "catalogue"];

    if ((!content?.trim() && !payload) || !chatId) {
        return res.status(400).json({
            message: "Message content and chat ID are required",
        });
    }

    if (!supportedKinds.includes(kind)) {
        return res.status(400).json({ message: "Unsupported message type" });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    const isMember = chat.users.some(
        (chatUserId) => chatUserId.toString() === req.user._id.toString()
    );

    if (!isMember) {
        return res.status(403).json({ message: "Not authorized to send messages to this chat" });
    }

    if (replyTo && !mongoose.Types.ObjectId.isValid(replyTo)) {
        return res.status(400).json({ message: "Invalid reply message ID" });
    }

    if (replyTo && !(await Message.exists({ _id: replyTo, chat: chatId }))) {
        return res.status(404).json({ message: "Reply message not found in this chat" });
    }

    let message = await Message.create({
        sender: req.user._id,
        content: content?.trim() || "",
        kind,
        payload,
        chat: chatId,
        replyTo: replyTo || null,
    });

    message = await message.populate("sender", "name pic email");
    message = await message.populate({
        path: "replyTo",
        select: "content sender",
        populate: { path: "sender", select: "name" },
    });
    message = await message.populate("chat");

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message._id,
    });

    const io = req.app.get("io");
    const senderId = req.user._id.toString();

    if (io) {
        let messageBroadcast = io
            .to(chat._id.toString())
            .except(senderId);

        chat.users.forEach((chatUserId) => {
            const recipientId = chatUserId.toString();

            if (recipientId !== senderId) {
                messageBroadcast = messageBroadcast.to(recipientId);
            }
        });

        messageBroadcast.emit(
            "message received",
            message.toObject()
        );
    }

    return res.status(201).json(message);
});

const voteOnPoll = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { optionIndex } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
    }

    if (!Number.isInteger(optionIndex)) {
        return res.status(400).json({ message: "Invalid poll option" });
    }

    const message = await Message.findById(messageId);

    if (!message || message.kind !== "poll") {
        return res.status(404).json({ message: "Poll not found" });
    }

    const chat = await Chat.findById(message.chat);
    const userId = req.user._id.toString();

    if (!chat || !chat.users.some((chatUserId) => chatUserId.toString() === userId)) {
        return res.status(403).json({ message: "Not authorized to vote in this poll" });
    }

    const options = message.payload?.options;

    if (!Array.isArray(options) || optionIndex < 0 || optionIndex >= options.length) {
        return res.status(400).json({ message: "Poll option does not exist" });
    }

    options.forEach((option) => {
        option.votes = (option.votes || []).filter(
            (voterId) => voterId.toString() !== userId
        );
    });
    options[optionIndex].votes.push(req.user._id);
    message.markModified("payload");
    await message.save();
    await message.populate("sender", "name pic email");
    await message.populate("chat");

    const io = req.app.get("io");

    if (io) {
        let updateBroadcast = io.to(chat._id.toString()).except(userId);
        chat.users.forEach((chatUserId) => {
            const recipientId = chatUserId.toString();
            if (recipientId !== userId) {
                updateBroadcast = updateBroadcast.to(recipientId);
            }
        });
        updateBroadcast.emit("message updated", message.toObject());
    }

    return res.status(200).json(message);
});

const toggleMessageReaction = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
    }

    if (!allowedReactions.includes(emoji)) {
        return res.status(400).json({ message: "Invalid reaction" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
        return res.status(404).json({ message: "Message not found" });
    }

    const chat = await Chat.findById(message.chat);

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    const userId = req.user._id.toString();
    const isMember = chat.users.some(
        (chatUserId) => chatUserId.toString() === userId
    );

    if (!isMember) {
        return res.status(403).json({ message: "Not authorized to react in this chat" });
    }

    const existingReaction = message.reactions.find(
        (reaction) => reaction.user.toString() === userId
    );

    if (existingReaction?.emoji === emoji) {
        message.reactions = message.reactions.filter(
            (reaction) => reaction.user.toString() !== userId
        );
    } else if (existingReaction) {
        existingReaction.emoji = emoji;
    } else {
        message.reactions.push({ user: req.user._id, emoji });
    }

    await message.save();
    await message.populate("sender", "name pic email");
    await message.populate("reactions.user", "name pic");
    await message.populate("chat");

    return res.status(200).json(message);
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const mode = req.body?.mode || "everyone";

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
        return res.status(404).json({ message: "Message not found" });
    }

    const chat = await Chat.findById(message.chat);
    const userId = req.user._id.toString();

    if (!chat || !chat.users.some(
        (chatUserId) => chatUserId.toString() === userId
    )) {
        return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    if (mode === "me") {
        await Message.updateOne(
            { _id: message._id },
            { $addToSet: { deletedFor: req.user._id } }
        );

        req.app.get("io")?.to(userId).emit(
            "message hidden for me",
            {
                messageId: message._id.toString(),
                chatId: chat._id.toString(),
            }
        );

        return res.status(200).json({
            mode,
            messageId: message._id,
        });
    }

    if (!["everyone", "unsend"].includes(mode)) {
        return res.status(400).json({ message: "Invalid delete mode" });
    }

    if (message.sender.toString() !== userId) {
        return res.status(403).json({
            message: "Only the sender can delete a message for everyone",
        });
    }

    if (mode === "unsend") {
        const wasLatestMessage =
            chat.latestMessage?.toString() === message._id.toString();

        await message.deleteOne();

        if (wasLatestMessage) {
            const latestMessage = await Message.findOne({ chat: chat._id })
                .sort({ createdAt: -1 })
                .select("_id");

            await Chat.findByIdAndUpdate(chat._id, {
                latestMessage: latestMessage?._id || null,
            });
        }

        const io = req.app.get("io");

        if (io) {
            let deleteBroadcast = io
                .to(chat._id.toString())
                .except(userId);

            chat.users.forEach((chatUserId) => {
                const recipientId = chatUserId.toString();

                if (recipientId !== userId) {
                    deleteBroadcast = deleteBroadcast.to(recipientId);
                }
            });

            deleteBroadcast.emit("message deleted", {
                messageId: message._id.toString(),
                chatId: chat._id.toString(),
            });
        }

        return res.status(200).json({
            mode,
            messageId: message._id,
        });
    }

    message.deletedForEveryone = true;
    message.unsent = false;
    message.deletedAt = new Date();
    message.content = "";
    message.replyTo = null;
    message.reactions = [];
    await message.save();
    await message.populate("sender", "name pic email");
    await message.populate("chat");

    const io = req.app.get("io");

    if (io) {
        let messageBroadcast = io
            .to(chat._id.toString())
            .except(userId);

        chat.users.forEach((chatUserId) => {
            const recipientId = chatUserId.toString();

            if (recipientId !== userId) {
                messageBroadcast = messageBroadcast.to(recipientId);
            }
        });

        messageBroadcast.emit(
            "message updated",
            message.toObject()
        );
    }

    return res.status(200).json({
        mode,
        message: message.toObject(),
    });
});

module.exports = {
    allMessages,
    sendMessage,
    toggleMessageReaction,
    voteOnPoll,
    deleteMessage,
};