import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateEnrollmentInput } from "../types";
import { enrollment } from "../services/enrollment.service";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";


const enrollStudent = asyncHandler(async(req: Request, res: Response) => {
    const input: CreateEnrollmentInput = req.body

    const userId = req.user?.id;

    if(!userId){
        throw new ApiError(401, "Unauthorized Request");
    }

    const newEnrollment = await enrollment(input, userId);

    const { ...enrolled } = newEnrollment;

    res.status(201).json(
        new ApiResponse(200, enrolled, "Enrollment Done Successfully")
    );
})

const unenrollStudent = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    
    await prisma.enrollment.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "Enrollment Deleted Successfully"))
})

const getAllEnrollment = asyncHandler(async(req: Request, res: Response) => {
    const userId = req?.user?.id

    if(!userId){
        throw new ApiError(401, "Unauthorized Request");
    }

    const enrollment = await prisma.enrollment.findMany({
        where: {
            userId: userId
        }
    })

    res.status(200).json(new ApiResponse(200, enrollment, "Enrollments fetched Succesfully"));
})

const getEnrollmentById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: id
        }
    });

    if(!enrollment){
        throw new ApiError(404, "Enrollment not found");
    }

    res.status(200).json(new ApiResponse(200, enrollment, "Enrollment fetched Successfully"))
})

export { enrollStudent, unenrollStudent, getAllEnrollment, getEnrollmentById }