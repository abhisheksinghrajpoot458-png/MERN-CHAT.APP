// // // const asyncHandler = require("express-async-handler");
// // // const User = require("../Models/userModel");
// // // const generateToken = require("../config/generateToken");

// // // // Register User
// // // const registerUser = asyncHandler(async (req, res) => {
// // //     const { name, email, password, pic } = req.body || {};

// // //     if (!name || !email || !password) {
// // //         res.status(400);
// // //         throw new Error("Please Enter all the Fields");
// // //     }

// // //     const userExists = await User.findOne({ email });

// // //     if (userExists) {
// // //         res.status(400);
// // //         throw new Error("User already exists");
// // //     }

// // //     const user = await User.create({
// // //         name,
// // //         email,
// // //         password,
// // //         pic,
// // //     });

// // //     if (user) {
// // //         res.status(201).json({
// // //             _id: user._id,
// // //             name: user.name,
// // //             email: user.email,
// // //             pic: user.pic,
// // //             token: generateToken(user._id),
// // //         });
// // //     } else {
// // //         res.status(400);
// // //         throw new Error("Failed to Create the User");
// // //     }
// // // });

// // // // Login User
// // // const authUser = asyncHandler(async (req, res) => {
// // //     const { email, password } = req.body || {};
// // // console.log("========== LOGIN ==========");
// // //     console.log("Email:", email);
// // //     console.log("Password:", password);

// // //     if (!email || !password) {
// // //         res.status(400);
// // //         throw new Error("Please enter email and password");
// // //     }

// // //     const user = await User.findOne({ email });

// // //     if (user && (await user.matchPassword(password))) {
// // //         res.status(200).json({
// // //             _id: user._id,
// // //             name: user.name,
// // //             email: user.email,
// // //             pic: user.pic,
// // //             token: generateToken(user._id),
// // //         });
// // //     } else {
// // //         res.status(401);
// // //         throw new Error("Invalid Email or Password");
// // //     }
// // // });

// // // module.exports = {
// // //     registerUser,
// // //     authUser,
// // // };


// // const asyncHandler = require("express-async-handler");
// // const User = require("../Models/userModel");
// // const generateToken = require("../config/generateToken");

// // // =========================
// // // Register User
// // // =========================
// // const registerUser = asyncHandler(async (req, res) => {
// //     const { name, email, password, pic } = req.body || {};

// //     // Check required fields
// //     if (!name || !email || !password) {
// //         res.status(400);
// //         throw new Error("Please Enter all the Fields");
// //     }

// //     // Normalize email
// //     const normalizedEmail = email.trim().toLowerCase();

// //     // Check if user already exists
// //     const userExists = await User.findOne({
// //         email: normalizedEmail,
// //     });

// //     if (userExists) {
// //         res.status(400);
// //         throw new Error("User already exists");
// //     }

// //     // Create user
// //     const user = await User.create({
// //         name: name.trim(),
// //         email: normalizedEmail,
// //         password,
// //         pic,
// //     });

// //     if (user) {
// //         res.status(201).json({
// //             _id: user._id,
// //             name: user.name,
// //             email: user.email,
// //             pic: user.pic,
// //             token: generateToken(user._id),
// //         });
// //     } else {
// //         res.status(400);
// //         throw new Error("Failed to Create the User");
// //     }
// // });

// // // =========================
// // // Login User
// // // =========================
// // const authUser = asyncHandler(async (req, res) => {
// //     const { email, password } = req.body || {};

// //     console.log("========== LOGIN ==========");
// //     console.log("Email:", email);
// //     console.log("Password:", password);

// //     // Check fields
// //     if (!email || !password) {
// //         res.status(400);
// //         throw new Error("Please enter email and password");
// //     }

// //     // Normalize email
// //     const normalizedEmail = email.trim().toLowerCase();

// //     // Find user
// //     const user = await User.findOne({
// //         email: normalizedEmail,
// //     });

// //     console.log("User Found:", user ? "YES" : "NO");

// //     // User not found
// //     if (!user) {
// //         res.status(401);
// //         throw new Error("Invalid Email or Password");
// //     }

// //     // Check password
// //     const passwordMatch = await user.matchPassword(password);

// //     console.log("Password Match:", passwordMatch);

// //     // Password incorrect
// //     if (!passwordMatch) {
// //         res.status(401);
// //         throw new Error("Invalid Email or Password");
// //     }

// //     // Login successful
// //     console.log("LOGIN SUCCESS");

// //     res.status(200).json({
// //         _id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         pic: user.pic,
// //         token: generateToken(user._id),
// //     });
// // });

// // // /api/user?search=abhi
// // const allUsers = asyncHandler(async (req, res) => {
    
// //     const keyword = req.query.search;
// //     console.log(keyword);

// // })

// // module.exports = {
// //     registerUser,
// //     authUser,
// // };


// const asyncHandler = require("express-async-handler");
// const User = require("../Models/userModel");
// const generateToken = require("../config/generateToken");

// // =========================
// // Register User
// // =========================
// const registerUser = asyncHandler(async (req, res) => {
//     const { name, email, password, pic } = req.body || {};

//     if (!name || !email || !password) {
//         res.status(400);
//         throw new Error("Please Enter all the Fields");
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const userExists = await User.findOne({
//         email: normalizedEmail,
//     });

//     if (userExists) {
//         res.status(400);
//         throw new Error("User already exists");
//     }

//     const user = await User.create({
//         name: name.trim(),
//         email: normalizedEmail,
//         password,
//         pic,
//     });

//     if (user) {
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             pic: user.pic,
//             token: generateToken(user._id),
//         });
//     } else {
//         res.status(400);
//         throw new Error("Failed to Create the User");
//     }
// });

// // =========================
// // Login User
// // =========================
// const authUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body || {};

//     console.log("========== LOGIN ==========");
//     console.log("Email:", email);
//     console.log("Password:", password);

//     if (!email || !password) {
//         res.status(400);
//         throw new Error("Please enter email and password");
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     const user = await User.findOne({
//         email: normalizedEmail,
//     });

//     console.log("User Found:", user ? "YES" : "NO");

//     if (!user) {
//         res.status(401);
//         throw new Error("Invalid Email or Password");
//     }

//     const passwordMatch = await user.matchPassword(password);

//     console.log("Password Match:", passwordMatch);

//     if (!passwordMatch) {
//         res.status(401);
//         throw new Error("Invalid Email or Password");
//     }

//     console.log("LOGIN SUCCESS");

//     res.status(200).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         pic: user.pic,
//         token: generateToken(user._id),
//     });
// });

// // =========================
// // Get All Users
// // =========================
// const allUsers = asyncHandler(async (req, res) => {
//     const keyword = req.query.search
//         ? {
//               $or: [
//                   {
//                       name: {
//                           $regex: req.query.search,
//                           $options: "i",
//                       },
//                   },
//                   {
//                       email: {
//                           $regex: req.query.search,
//                           $options: "i",
//                       },
//                       name: {
//                           $regex: req.query.search,
//                           $options: "i",
//                       },
//                   },
//               ],
//           }
//         : {};

//     const users = await User.find(keyword)
//         .select("-password")
//         .limit(20);

//     res.status(200).json(users);
// });

// module.exports = {
//     registerUser,
//     authUser,
//     allUsers,
// };


const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");


// ========================================
// REGISTER USER
// ========================================

const registerUser = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        pic,
    } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error(
            "Please enter all required fields"
        );
    }

    const existingUser = await User.findOne({
        email,
    });

    if (existingUser) {
        res.status(400);
        throw new Error(
            "User already exists"
        );
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User registration failed");
    }
});


// ========================================
// LOGIN USER
// ========================================

const loginUser = asyncHandler(async (req, res) => {
    const {
        email,
        password,
    } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error(
            "Please provide email and password"
        );
    }

    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    });

    if (
        user &&
        (await user.matchPassword(password))
    ) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error(
            "Invalid Email or Password"
        );
    }
});


// ========================================
// SEARCH USERS
// ========================================

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  {
                      name: {
                          $regex: req.query.search,
                          $options: "i",
                      },
                  },
                  {
                      email: {
                          $regex: req.query.search,
                          $options: "i",
                      },
                  },
              ],
          }
        : {};

    const users = await User.find(keyword)
        .find({
            _id: {
                $ne: req.user._id,
            },
        })
        .select("-password");

    res.status(200).json(users);
});


module.exports = {
    registerUser,
    loginUser,
    allUsers,
};

