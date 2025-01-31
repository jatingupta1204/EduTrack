import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createGradeInput } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";
import { changeGrade, giveGrade } from "../services/grade.service";


const createGrade = asyncHandler(async(req: Request, res: Response) => {
    const input: createGradeInput = req.body;

    const userId = req.user?.id

    if(!userId){
        throw new ApiError(404, "User Not Found");
    }

    const newGrade = await giveGrade(input, userId);

    const { ...gradeGiven } = newGrade;

    res.status(201).json(new ApiResponse(200, gradeGiven, "Grades Successfully Given"))
})

const deleteGrade = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    
    await prisma.grade.delete({
        where: {
            id: id
        }
    })

    res.status(200).json(new ApiResponse(200, {}, "Grade Removed Successfully"));
})

const updateGrade = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const { grade } = req.body;

    const grades = await changeGrade(grade, id);

    const { ...updatedGrade } = grades;

    res.status(200).json(new ApiResponse(200, updatedGrade, "Grade Updated Successfully"));
})

const getAllGrade = asyncHandler(async(req: Request, res: Response) => {
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
    
    const grades = await prisma.grade.findMany({
        where: {
            enrollmentId: { in: enrollmentIds}
        }
    })

    res.status(200).json(new ApiResponse(200, grades, "Grade Fetched Successfully"));
})

const getGradeById = asyncHandler(async(req: Request, res: Response) => {
    const { enrollmentId } = req.params;

    if(!enrollmentId){
        throw new ApiError(400, "Enrollment ID is required");
    }

    const gradeRecords = await prisma.grade.findMany({
        where: {
            enrollmentId
        }
    });

    if(!gradeRecords){
        throw new ApiError(404, "No Grade Record Found for this Enrollment");
    }

    res.status(200).json(new ApiResponse(200, gradeRecords, "Grade Records Fetched Successfully"));
})

export { createGrade, deleteGrade, updateGrade, getAllGrade, getGradeById }