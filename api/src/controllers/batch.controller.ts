import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createBatchInput } from "../types";
import { addBatch, changeBatch } from "../services/batch.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createBatch = asyncHandler(async(req: Request, res: Response) => {
    const input: createBatchInput = req.body;

    const batch = await addBatch(input)

    const { ...createdBatch} = batch;

    res.status(201).json(new ApiResponse(200, createdBatch, "Batch Created Successfully"));
})

const deleteBatch = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.batch.delete({
        where: {
            id: id
        }
    })

    res.status(200).json(new ApiResponse(200, {}, "Batch Deleted Successfully"));
})

const updateBatch = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const { academicYearId, coordinatorId } = req.body;

    const batch = await changeBatch(academicYearId, coordinatorId);

    const { ...updatedBatch } = batch;

    res.status(200).json(new ApiResponse(200, updatedBatch, "Batch Updated Successfully"));
})

const getAllBatch = asyncHandler(async(req: Request, res: Response) => {
    const batch = await prisma.batch.findMany({});

    res.status(200).json(new ApiResponse(200, batch, "Batch Fetched Successfully"));
})

const getBatchById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const batch = await prisma.batch.findUnique({
        where: {
            id: id
        }
    });
    
    if(!batch){
        throw new ApiError(404, "Batch Not Found");
    }

    res.status(200).json(new ApiResponse(200, batch, "Batch Fetched Successfully"));
})

export { createBatch, deleteBatch, updateBatch, getAllBatch, getBatchById }