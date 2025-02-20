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
import attendanceRouter from "./routes/attendance.routers";
import schoolRouter from "./routes/school.routers";
import departmentRouter from "./routes/department.routers";
import semesterRouter from "./routes/semester.routers";
import batchRouter from "./routes/batch.routers";
import gradeRouter from "./routes/grade.routers";
import dashboardRouter from "./routes/dashboard.routers";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/enrollments", enrollmentRouter);
app.use("/api/v1/attendances", attendanceRouter);
app.use("/api/v1/schools", schoolRouter);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/semesters", semesterRouter);
app.use("/api/v1/batches", batchRouter);
app.use("/api/v1/grades", gradeRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT - ${PORT}`);
});

export { prisma }