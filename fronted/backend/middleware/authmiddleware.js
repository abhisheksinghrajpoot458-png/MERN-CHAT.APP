

// // // const jwt = require("jsonwebtoken");
// // // const User = require("../Models/userModel.js");
// // // const asyncHandler = require("express-async-handler");

// // // const protect = asyncHandler(async (req, res, next) => {
// // //     let token;

// // //     // Check Authorization header
// // //     if (
// // //         req.headers.authorization &&
// // //         req.headers.authorization.startsWith("Bearer")
// // //     ) {
// // //         try {
// // //             // Get token
// // //             token = req.headers.authorization.split(" ")[1];

// // //             // Verify token
// // //             const decoded = jwt.verify(
// // //                 token,
// // //                 process.env.JWT_SECRET
// // //             );

// // //             // Get user from token
// // //             req.user = await User.findById(decoded.id).select("-password");

// // //             if (!req.user) {
// // //                 res.status(401);
// // //                 throw new Error("User not found");
// // //             }

// // //             next();
// // //         } catch (error) {
// // //             console.log("JWT Error:", error.message);

// // //             res.status(401);
// // //             throw new Error("Not authorized, token failed");
// // //         }
// // //     }

// // //     // No token
// // //     if (!token) {
// // //         res.status(401);
// // //         throw new Error("Not authorized, no token");
// // //     }
// // // });

// // // module.exports = {
// // //     protect,
// // // };


// // const jwt = require("jsonwebtoken");
// // const User = require("../Models/userModel.js");
// // const asyncHandler = require("express-async-handler");

// // const protect = asyncHandler(async (req, res, next) => {
// //     let token;

// //     const authHeader = req.headers.authorization;

// //     if (authHeader && authHeader.startsWith("Bearer ")) {
// //         try {
// //             // Get token after "Bearer "
// //             token = authHeader.split(" ")[1];

// //             // Verify token
// //             const decoded = jwt.verify(
// //                 token,
// //                 process.env.JWT_SECRET
// //             );

// //             // Find user
// //             req.user = await User.findById(decoded.id).select("-password");

// //             if (!req.user) {
// //                 res.status(401);
// //                 throw new Error("User not found");
// //             }

// //             next();
// //         } catch (error) {
// //             console.log("JWT Error:", error.message);

// //             res.status(401);
// //             throw new Error("Not authorized, token failed");
// //         }
// //     } else {
// //         res.status(401);
// //         throw new Error("Not authorized, no token");
// //     }
// // });

// // module.exports = {
// //     protect,
// // };


// const jwt = require("jsonwebtoken");
// const User = require("../Models/userModel.js");
// const asyncHandler = require("express-async-handler");

// const protect = asyncHandler(async (req, res, next) => {
//     let token;

//     const authHeader = req.headers.authorization;

//     if (
//         authHeader &&
//         authHeader.startsWith("Bearer ")
//     ) {
//         try {
//             token = authHeader.split(" ")[1];

//             const decoded = jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );

//             req.user = await User.findById(decoded.id).select("-password");

//             if (!req.user) {
//                 res.status(401);
//                 throw new Error("User not found");
//             }

//             next();

//         } catch (error) {
//             console.log("JWT Error:", error.message);

//             res.status(401);
//             throw new Error("Not authorized, token failed");
//         }
//     } else {
//         res.status(401);
//         throw new Error("Not authorized, no token");
//     }
// });

// module.exports = { protect };


const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = await User.findById(
                decoded.id
            ).select("-password");

            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }

            next();

        } catch (error) {
            console.error("Auth Error:", error.message);

            res.status(401);
            throw new Error("Not authorized, token failed");
        }

    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };

