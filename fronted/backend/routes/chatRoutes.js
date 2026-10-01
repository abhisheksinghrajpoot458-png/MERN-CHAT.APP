

// const express = require("express");

// const router = express.Router();

// const {
//     accessChat,
//     fetchChats,
//     createGroupChat,
//     renameGroup,removeFromGroup,addToGroup,
// } = require("../controllers/chatControllers");

// const { protect } = require("../middleware/authMiddleware");


// // One-to-One Chat
// router.post("/", protect, accessChat);

// router.get("/", protect, fetchChats);


// // Create Group Chat
// router.post("/group", protect, createGroupChat);


// // Rename Group
// router.put("/rename", protect, renameGroup);
// router.put("/groupadd", protect, addToGroup);
// router.put("/groupremove", protect, removeFromGroup);



// module.exports = router;


const express = require("express");

const router = express.Router();

const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
} = require("../controllers/chatControllers");

const { protect } = require("../middleware/authMiddleware");


// One-to-One Chat
router.post("/", protect, accessChat);

router.get("/", protect, fetchChats);


// Create Group
router.post("/group", protect, createGroupChat);


// Rename Group
router.put("/rename", protect, renameGroup);


// Add User
router.put("/groupadd", protect, addToGroup);


// Remove User
router.put("/groupremove", protect, removeFromGroup);


module.exports = router;