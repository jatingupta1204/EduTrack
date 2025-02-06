import { AttendanceStatus } from "@prisma/client";
import { prisma } from "..";
import { CreateAttendanceInput } from "../types";
import { ApiError } from "../utils/ApiError";


const giveAttendance = async(input: CreateAttendanceInput, userId: string) => {
    const { enrollmentId, status } = input;

    if(!enrollmentId || !status || !userId ){
        throw new ApiError(400, "All fields are required");
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId
        }
    });

    if(!enrollment){
        throw new ApiError(404, "Enrolled Student not found");
    }

    const today = new Date().toISOString();
    const existingAttendance = await prisma.attendance.findFirst({
        where: {
            enrollmentId: enrollmentId,
            date: today,
        }
    });

    if(existingAttendance){
        throw new ApiError(409, "Attendance already given");
    }

    const attendance = await prisma.attendance.create({
        data: {
            enrollmentId,
            status: status as AttendanceStatus,
            markedById: userId
        }
    });

    const attendanceGiven = await prisma.attendance.findUnique({
        where: {
            id: attendance.id
        }
    });

    if(!attendanceGiven){
        throw new ApiError(500, "Something went wrong while giving attendance");
    }

    return attendanceGiven;
}

const changeAttendance = async(status: AttendanceStatus, id: string) => {
    const attendance = await prisma.attendance.findUnique({
        where: {
            id: id
        }
    });

    if(!attendance){
        throw new ApiError(401, "Attendance not found")
    }

    const updatedAttendance = await prisma.attendance.update({
        where: {
            id: id
        },
        data: {
            status
        }
    })

    return updatedAttendance;
}

export { giveAttendance, changeAttendance }