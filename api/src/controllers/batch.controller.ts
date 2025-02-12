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

    const { semesterId, schedule_info, coordinatorId } = req.body;

    const batch = await changeBatch(id, semesterId, schedule_info, coordinatorId);

    const { ...updatedBatch } = batch;

    res.status(200).json(new ApiResponse(200, updatedBatch, "Batch Updated Successfully"));
})

const getAllBatch = asyncHandler(async(req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const paginate = req.query.paginate === "false" ? false : true;
    const skip = (page - 1) * limit;

    const batch = await prisma.batch.findMany({
        ...(paginate ? { skip, take: limit } : {})
    });

    const totalBatch = await prisma.batch.count();
    const totalPages = paginate ? Math.ceil(totalBatch / limit) : 1;

    res.status(200).json(new ApiResponse(200, {batch, totalPages}, "Batch Fetched Successfully"));
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