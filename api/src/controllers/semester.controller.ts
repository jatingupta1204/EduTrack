import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { changeSemesterInfo, createSemesterInput } from "../types";
import { addSemester, changeSemester } from "../services/semester.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createSemester = asyncHandler(async(req: Request, res: Response) => {
    const input: createSemesterInput = req.body;

    const semester = await addSemester(input);

    const { ...createdSemester } = semester;

    res.status(201).json(new ApiResponse(200, createdSemester, "Semester Created Successfully"));
})

const deleteSemester = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.semester.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "Semester Deleted Successfully"));
})

const updateSemester = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const input: changeSemesterInfo = req.body;

    const semester = await changeSemester(id, input);

    const { ...updatedSemester } = semester;

    res.status(200).json(new ApiResponse(200, updatedSemester, "Semester Updated Successfully"));
})

const getAllSemester = asyncHandler(async(req: Request, res: Response) => {
    const semester = await prisma.semester.findMany({});

    res.status(200).json(new ApiResponse(200, semester, "Semesters Fetched Successfully"));
})

const getSemesterById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const semester = await prisma.semester.findUnique({
        where: {
            id: id
        }
    });

    if(!semester){
        throw new ApiError(404, "Semester Not Found");
    }

    res.status(200).json(new ApiResponse(200, semester, "Semester Fetched Successfully"));
})

export { createSemester, deleteSemester, updateSemester, getAllSemester, getSemesterById }