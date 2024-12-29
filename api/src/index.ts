import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

const PORT : number = Number.parseInt(<string>process.env.PORT, 10);

const prisma = new PrismaClient();
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routers";

app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT - ${PORT}`);
});

export { prisma }