const express = require("express");

const router = express.Router();

const {
    allMessages,
    sendMessage,
    toggleMessageReaction,
    voteOnPoll,
    deleteMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, sendMessage);
router.route("/:messageId/reactions").patch(protect, toggleMessageReaction);
router.route("/:messageId/vote").patch(protect, voteOnPoll);
router.route("/:messageId").delete(protect, deleteMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;