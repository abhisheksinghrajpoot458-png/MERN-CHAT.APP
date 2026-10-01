// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const colors = require("colors");
// const userRoutes = require("./routes/userRoutes");
// dotenv.config({
//     path: path.join(__dirname, ".env")
// });

// console.log("JWT_SECRET:", process.env.JWT_SECRET ? "LOADED" : "NOT LOADED");



// const { chats } = require("./data/data.js");
// const app = express();

// app.use(express.json()); // to accept json data

// app.get('/', (req, res) => {
//     res.send("API is Running Successfully");
// });

// app.use('/api/user',userRoutes);

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//     try {
//         await connectDB();
//         app.listen(PORT, () => {
//             console.log(`Server is running on PORT ${PORT}`.yellow.bold);
//         });
//     } catch (error) {
//         console.error(`Database connection failed: ${error.message}`.red.bold);
//         process.exit(1);
//     }
// };

// startServer();

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");

dotenv.config({
    path: path.join(__dirname, ".env")
});

console.log("JWT_SECRET:", process.env.JWT_SECRET ? "LOADED" : "NOT LOADED");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is Running Successfully");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`.yellow.bold);
        });
    } catch (error) {
        console.error(
            `Database connection failed: ${error.message}`.red.bold
        );
        process.exit(1);
    }
};

startServer();