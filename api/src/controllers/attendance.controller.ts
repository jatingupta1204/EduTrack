import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateAttendanceInput } from "../types";
import { changeAttendance, giveAttendance } from "../services/attendance.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createAttendance = asyncHandler(async(req: Request, res: Response) => {
    const input: CreateAttendanceInput = req.body;

    const userId = req.user?.id

    if(!userId){
        throw new ApiError(404, "User Not Found");
    }

    const newAttendance = await giveAttendance(input, userId);

    const { ...attendanceGiven } = newAttendance;

    res.status(201).json(new ApiResponse(200, attendanceGiven, "Attendance Successfully Given"))
})

const deleteAttendance = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    
    await prisma.attendance.delete({
        where: {
            id: id
        }
    })

    res.status(200).json(new ApiResponse(200, {}, "Attendance Removed Successfully"));
})

const updateAttendance = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const { status } = req.body;

    const attendance = await changeAttendance(status, id);

    const { ...updatedAttendance } = attendance;

    res.status(200).json(new ApiResponse(200, updatedAttendance, "Attendance Updated Successfully"));
})

const getAllAttendance = asyncHandler(async(req: Request, res: Response) => {
    const userId = req.user?.id

    if(!userId){
        throw new ApiError(404, "User Not Found")
    }

    const enrollment = await prisma.enrollment.findMany({
        where: {
            studentId: userId
        },
        select: {
            id: true
        }
    });

    if(!enrollment || enrollment.length === 0){
        throw new ApiError(404, "No Course Found")
    }

    const enrollmentIds = enrollment.map(enrollment => enrollment.id);
    
    const attendance = await prisma.attendance.findMany({
        where: {
            enrollmentId: { in: enrollmentIds}
        }
    })

    res.status(200).json(new ApiResponse(200, attendance, "Attendance Fetched Successfully"));
})

const getAttendanceById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    if(!id){
        throw new ApiError(400, "Enrollment ID is required");
    }

    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            enrollmentId: id
        }
    });

    if(!attendanceRecords){
        throw new ApiError(404, "No Attendance Record Found for this Enrollment");
    }

    res.status(200).json(new ApiResponse(200, attendanceRecords, "Attendance Records Fetched Successfully"));
})

export { createAttendance, deleteAttendance, updateAttendance, getAllAttendance, getAttendanceById }