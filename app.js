import express from "express";
import cors from "cors";

import prisma from "./utils/prismaClient.js";
import {contentRouter} from "./router/content.js"
import {userRouter} from "./router/user.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", userRouter);
app.use("/content", contentRouter);


const server = app.listen(8000, () => console.log("Server is running on port 8000"));

const gracefulShutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log("API Server disconnected");
        process.exit(0);
    });
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
