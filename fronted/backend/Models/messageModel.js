const mongoose = require('mongoose')

const reactionSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        emoji: { type: String, required: true },
    },
    { _id: false }
);

const messageModel = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        kind: {
            type: String,
            enum: ["text", "file", "contact", "poll", "event", "sticker", "catalogue"],
            default: "text",
        },
        payload: { type: mongoose.Schema.Types.Mixed, default: null },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        reactions: { type: [reactionSchema], default: [] },
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
        deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        deletedForEveryone: { type: Boolean, default: false },
        unsent: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;