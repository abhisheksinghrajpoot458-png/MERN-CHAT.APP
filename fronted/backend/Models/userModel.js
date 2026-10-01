

// // const mongoose = require("mongoose");
// // const bcrypt = require("bcryptjs");

// // const userSchema = mongoose.Schema(
// //     {
// //         name: {
// //             type: String,
// //             required: true,
// //         },

// //         email: {
// //             type: String,
// //             required: true,
// //             unique: true,
// //         },

// //         password: {
// //             type: String,
// //             required: true,
// //         },

// //         pic: {
// //             type: String,
// //             default:
// //                 "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
// //         },
// //     },
// //     {
// //         timestamps: true,
// //     }
// // );

// // // Check password
// // userSchema.methods.matchPassword = async function (enteredPassword) {
// //     return await bcrypt.compare(enteredPassword, this.password);
// // };

// // // Hash password before saving
// // userSchema.pre("save", async function (next) {
// //     if (!this.isModified("password")) {
// //         return next();
// //     }

// //     const salt = await bcrypt.genSalt(10);

// //     this.password = await bcrypt.hash(this.password, salt);

// //     next();
// // });

// // const User = mongoose.model("User", userSchema);

// // module.exports = User;

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//         },

//         email: {
//             type: String,
//             required: true,
//             unique: true,
//         },

//         password: {
//             type: String,
//             required: true,
//         },

//         pic: {
//             type: String,
//             default:
//                 "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// // Compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// // Hash password before saving
// userSchema.pre("save", async function () {
//     // Password change nahi hua hai to kuch nahi karna
//     if (!this.isModified("password")) {
//         return;
//     }

//     // Generate salt
//     const salt = await bcrypt.genSalt(10);

//     // Hash password
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Create User model
// const User = mongoose.model("User", userSchema);

// module.exports = User;


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        pic: {
            type: String,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


// ===============================
// HASH PASSWORD
// ===============================

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});


// ===============================
// CHECK PASSWORD
// ===============================

userSchema.methods.matchPassword = async function (
    enteredPassword
) {
    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};


module.exports = mongoose.model(
    "User",
    userSchema
);

