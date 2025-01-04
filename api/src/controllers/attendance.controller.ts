import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateAttendanceInput } from "../types";
import { giveAttendance } from "../services/attendance.service";
import { ApiResponse } from "../utils/ApiResponse";


const addAttendance = asyncHandler(async(req: Request, res: Response) => {
    const input: CreateAttendanceInput = req.body;

    const newAttendance = await giveAttendance(input);

    const { ...attendanceGiven } = newAttendance;

    res.status(201).json(new ApiResponse(200, attendanceGiven, "Attendance Successfully Given"))
})

export { addAttendance }