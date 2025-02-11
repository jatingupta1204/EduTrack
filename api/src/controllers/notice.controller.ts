import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateNoticeInput } from "../types/index";
import { addNotice, changeNotice } from "../services/notice.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createNotice = asyncHandler(async(req: Request, res: Response) => {
    const input : CreateNoticeInput = req.body;

    const newNotice = await addNotice(input);

    const { ...createdNotice} = newNotice;

    res.status(201).json(new ApiResponse(200, createdNotice, "Notice created successfully"));
})

const deleteNotice = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;

    await prisma.notice.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "Notice Deleted Successfully"));
})

const updateNotice = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const { description } = req.body;
    
    const notice = await changeNotice(description, id);

    const { ...updatedNotice } = notice

    res.status(200).json(new ApiResponse(200, updatedNotice, "Notice Updated Successfully"));
})

const getAllNotice = asyncHandler(async(req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const paginate = req.query.paginate === "false" ? false : true;
    const skip = (page - 1) * limit;

    const notice = await prisma.notice.findMany({
        ...(paginate ? { skip, take: limit } : {}),
    });

    const totalNotice = await prisma.notice.count();
    const totalPages = paginate ? Math.ceil(totalNotice / limit) : 1;

    res.status(200).json(new ApiResponse(200, {notice, totalPages}, "Notices fetched Successfully"));
})

const getNoticeById = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;

    const notice = await prisma.notice.findUnique({
        where: {
            id: id
        }
    });

    if(!notice){
        throw new ApiError(404, "Notice not found");
    }

    res.status(200).json(new ApiResponse(200, notice, "Notice fetched successfully"));
})

export { createNotice, deleteNotice, updateNotice, getAllNotice, getNoticeById };