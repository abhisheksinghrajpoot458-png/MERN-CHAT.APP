


// // const express = require("express");

// // const {
// //     registerUser,
// //     authUser,
// // } = require("../controllers/userControllers");

// // const router = express.Router();

// // // Register User
// // router.post("/", registerUser);

// // // Login User
// // router.post("/login", authUser);

// // module.exports = router;



// const express = require("express");

// const {
//     registerUser,
//     authUser,
//     allUsers,
// } = require("../controllers/userControllers");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// // Get/Search Users
// router.get("/",protect, allUsers);

// // Register User
// router.post("/", registerUser);

// // Login User
// router.post("/login", authUser);

// module.exports = router;


const express = require("express");

const {
    registerUser,
    loginUser,
    allUsers,
} = require("../controllers/userControllers");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Register
router
    .route("/")
    .post(registerUser)
    .get(protect, allUsers);


// Login
router.post(
    "/login",
    loginUser
);


module.exports = router;

