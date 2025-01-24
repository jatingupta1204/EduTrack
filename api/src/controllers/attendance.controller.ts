import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateAttendanceInput } from "../types";
import { changeAttendance, giveAttendance } from "../services/attendance.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";


const addAttendance = asyncHandler(async(req: Request, res: Response) => {
    const input: CreateAttendanceInput = req.body;

    const newAttendance = await giveAttendance(input);

    const { ...attendanceGiven } = newAttendance;

    res.status(201).json(new ApiResponse(200, attendanceGiven, "Attendance Successfully Given"))
})

const removeAttendance = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    
    await prisma.attendance.delete({
        where: {
            id: id
        }
    })

    res.status(200).json(new ApiResponse(200, {}, "Attendance Removed Successfully"));
})

const updateAttendance = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;

    const { status } = req.body;

    const attendance = await changeAttendance(status, id);
    
    const { ...updatedAttendance } = attendance;

    res.status(200).json(new ApiResponse(200, attendance, "Attendance Updated Successfully"));
})

const getAllAttendance = asyncHandler(async(req: Request, res: Response) => {
    
})

const getAttendanceById = asyncHandler(async(req: Request, res: Response) => {

})

export { addAttendance, removeAttendance, updateAttendance }