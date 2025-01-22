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
import noticeRouter from "./routes/notice.routers";
import courseRouter from "./routes/course.routers";
import enrollmentRouter from "./routes/enrollment.routers";
import schoolRouter from "./routes/school.routers";
import departmentRouter from "./routes/department.routers";
import academicYear from "./routes/academicYear.routers";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/enrollments", enrollmentRouter);
app.use("/api/v1/schools", schoolRouter);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/academicYears", academicYear);

app.listen(PORT, () => {
    console.log(`Server is running at PORT - ${PORT}`);
});

export { prisma }