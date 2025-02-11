import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createDepartmentInput } from "../types/index";
import { addDepartment, changeDepartment } from "../services/department.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
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

    const department = await changeDepartment(id, name, description, schoolId);

    const { ...updatedDepartment } = department

    res.status(200).json(new ApiResponse(200, updatedDepartment, "Department Updated Successfully"));
})

const getAllDepartment = asyncHandler(async(req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const paginate = req.query.paginate === "false" ? false : true;
    const skip = (page - 1) * limit;

    const department = await prisma.department.findMany({
        ...(paginate ? { skip, take: limit } : {}),
    })

    const totalDepartment = await prisma.department.count();
    const totalPages = paginate ? Math.ceil(totalDepartment / limit) : 1;
    
    res.status(200).json(new ApiResponse(200, {department, totalPages}, "Departments Fetched Successfully"));
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