import express from "express";
import mongoose from "mongoose";
import { userRoute } from "./routes/user.js";
import { courseRouter } from "./routes/course.js";
import { adminRoute } from "./routes/admin.js";
import dotenv from 'dotenv';
dotenv.config();
// Server Port
const port = 3000;
const app = express();


app.use(express.json());

// Middleware to use routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/course", courseRouter);

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

main();

/*
GET - These are generally used to retrieve the data and doesn't modify the data.
POST - Modify the data. Specifically used to create a new resource.
PUT - Modify the data. Specifically used to update existing resources.
*/
