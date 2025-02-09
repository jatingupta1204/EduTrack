import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createSchoolInput } from "../types";
import { addSchool, changeSchool } from "../services/school.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createSchool = asyncHandler(async(req: Request, res: Response) => {
    const input: createSchoolInput = req.body;

    const newSchool = await addSchool(input);

    const { ...createdSchool } = newSchool;

    res.status(201).json(new ApiResponse(200, createdSchool, "School Created Successfully"))
})

const deleteSchool = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.school.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "School Deleted Successfully"));
})

const updateSchool = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body; 

    const school = await changeSchool(id, name, description)

    const { ...updatedSchool } = school;

    res.status(200).json(new ApiResponse(200, updatedSchool, "School Updated Successfully"));
})

const getAllSchool = asyncHandler(async(req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const school = await prisma.school.findMany({
        skip,
        take: limit,
    });

    const totalSchools = await prisma.school.count();
    const totalPages = Math.ceil(totalSchools / limit);

    res.status(200).json(new ApiResponse(200, {school, totalPages}, "Schools fetched Successfully"));
})

const getSchoolById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const school = await prisma.school.findUnique({
        where: {
            id: id
        }
    })

    if(!school){
        throw new ApiError(404, "School Not found")
    }

    res.status(200).json(new ApiResponse(200, school, "School Fetched Successfully"));
})

export { createSchool, deleteSchool, updateSchool, getAllSchool, getSchoolById }