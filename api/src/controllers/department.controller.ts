import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createDepartmentInput } from "../types/department";
import { addDepartment } from "../services/department.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { changeSchool } from "../services/school.service";
import { ApiError } from "../utils/ApiError";


const createDepartment = asyncHandler(async(req: Request, res: Response) => {
    const input:createDepartmentInput = req.body

    const newDepartment = await addDepartment(input)

    const { ...createdDepartment } = newDepartment;

    res.status(201).json(new ApiResponse(200, createdDepartment, "Department Created Successfully"));
})

const deleteDepartment = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.department.delete({
        where: {
            id: id
        }
    })

    res.status(200).json(new ApiResponse(200, {}, "Department Deleted Successfully"));
})

const updateDepartment = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const { name, description, schoolId } = req.body;

    const department = await changeSchool(name, description, schoolId);

    const { ...updatedDepartment } = department

    res.status(200).json(new ApiResponse(200, updatedDepartment, "Department Updated Successfully"));
})

const getAllDepartment = asyncHandler(async(req: Request, res: Response) => {
    const department = await prisma.department.findMany({})

    res.status(200).json(new ApiResponse(200, department, "Departments Fetched Successfully"));
})

const getDepartmentById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
        where: {
            id: id
        }
    })

    if(!department){
        throw new ApiError(404, "Department not found");
    }

    res.status(200).json(new ApiResponse(200, department, "Department Fetched Successfully"));
})

export { createDepartment, deleteDepartment, updateDepartment, getAllDepartment, getDepartmentById }