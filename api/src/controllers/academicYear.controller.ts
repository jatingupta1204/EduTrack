import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createAcademicYearInput } from "../types/academicYear";
import { addAcademicYear, changeAcademicYear } from "../services/academicYear.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createAcademicYear = asyncHandler(async(req: Request, res: Response) => {
    const input: createAcademicYearInput = req.body;

    const academicYear = await addAcademicYear(input);

    const { ...createdAcademicYear } = academicYear;

    res.status(201).json(new ApiResponse(200, createdAcademicYear, "Academic Year Created Successfully"));
})

const deleteAcademicYear = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.academicYear.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "Academic Year Deleted Successfully"));
})

const updateAcademicYear = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;

    const academicYear = await changeAcademicYear(startDate, endDate, status);

    const { ...updatedAcademicYear } = academicYear;

    res.status(200).json(new ApiResponse(200, updatedAcademicYear, "Academic Year Updated Successfully"));
})

const getAllAcademicYear = asyncHandler(async(req: Request, res: Response) => {
    const academicYear = await prisma.academicYear.findMany({});

    res.status(200).json(new ApiResponse(200, academicYear, "AcademicYears Fetched Successfully"));
})

const getAcademicYearById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const academicYear = await prisma.academicYear.findUnique({
        where: {
            id: id
        }
    });

    if(!academicYear){
        throw new ApiError(404, "Department Not Found");
    }

    res.status(200).json(new ApiResponse(200, academicYear, "AcademicYear Fetched Successfully"));
})

export { createAcademicYear, deleteAcademicYear, updateAcademicYear, getAllAcademicYear, getAcademicYearById }