// // // // // // const mongoose = require("mongoose");
// // // // // // const connectDB = async () => {
// // // // // //     try {
// // // // // //         const conn = await mongoose.connect(process.env.MONGODB_URL);
// // // // // //         console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
// // // // // //     } catch (error) {
// // // // // //         console.log(`Error: ${error.message}`.red.underline.bold);
// // // // // //         process. exit();
// // // // // //     }
// // // // // // };

// // // // // // module.exports = connectDB;



// // // // // const mongoose = require("mongoose");

// // // // // const connectDB = async () => {
// // // // //   try {
// // // // //     const conn = await mongoose.connect(process.env.MONGO_URI);

// // // // //     console.log(`MongoDB Connected: ${conn.connection.host}`);
// // // // //   } catch (error) {
// // // // //     console.error(`MongoDB Connection Error: ${error.message}`);
// // // // //     process.exit(1);
// // // // //   }
// // // // // };

// // // // // module.exports = connectDB;


// // // // const mongoose = require("mongoose");

// // // // const connectDB = async () => {
// // // //   try {
// // // //     const conn = await mongoose.connect(process.env.MONGO_URI);

// // // //     console.log(`MongoDB Connected: ${conn.connection.host}`);
// // // //   } catch (error) {
// // // //     console.error(`MongoDB Connection Error: ${error.message}`);
// // // //     process.exit(1);
// // // //   }
// // // // };

// // // // module.exports = connectDB;

// // // const mongoose = require("mongoose");

// // // const connectDB = async () => {
// // //     try {
// // //         const conn = await mongoose.connect(process.env.MONGO_URI);

// // //         console.log(`MongoDB Connected: ${conn.connection.host}`);
// // //     } catch (error) {
// // //         console.error(`MongoDB Connection Error: ${error.message}`);
// // //         process.exit(1);
// // //     }
// // // };

// // // module.exports = connectDB;


// // const mongoose = require("mongoose");

// // const connectDB = async () => {
// //     try {
// //         const conn = await mongoose.connect(process.env.MONGO_URI);

// //         console.log(`MongoDB Connected: ${conn.connection.host}`);
// //     } catch (error) {
// //         console.error(`MongoDB Connection Error: ${error.message}`);
// //         process.exit(1);
// //     }
// // };

// // module.exports = connectDB;


// const mongoose = require("mongoose");

// const connectDB = async () => {
//     try {

//         // Connect MongoDB
//         const conn = await mongoose.connect(
//             process.env.MONGO_URI
//         );

//         console.log(
//             `MongoDB Connected: ${conn.connection.host}`
//         );

//         return conn;

//     } catch (error) {

//         console.error(
//             `MongoDB Connection Error: ${error.message}`
//         );

//         throw error;
//     }
// };

// module.exports = connectDB;



const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        const conn = await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000,
            }
        );

        console.log(
            `MongoDB Connected: ${conn.connection.host}`
        );

        return conn;

    } catch (error) {
        console.error(
            `MongoDB Connection Error: ${error.message}`
        );

        throw error;
    }
};

module.exports = connectDB;


