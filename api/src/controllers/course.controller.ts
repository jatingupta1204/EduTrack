import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { changeCourseInfo, CreateCourseInput } from "../types";
import { addCourse, changeCourse } from "../services/course.service";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";
import { ApiError } from "../utils/ApiError";


const createCourse = asyncHandler(async(req: Request, res: Response) => {
    const input: CreateCourseInput = req.body;

    const newCourse = await addCourse(input);

    const { ...createdCourse} = newCourse;

    res.status(201).json(new ApiResponse(200, createdCourse, "Course created successfully"));
})

const deleteCourse = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.course.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "Course Deletted Successfully"));
})

const updateCourse = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const input: changeCourseInfo = req.body;

    const course = await changeCourse(input, id);

    const { ...updatedCourse } = course;

    res.status(200).json(new ApiResponse(200, updatedCourse, "Course Updated Successfully"));
})

const getAllCourse = asyncHandler(async(req: Request, res: Response) => {
    const course = await prisma.course.findMany({});

    res.status(200).json(new ApiResponse(200, course, "Courses fetched Successfully"));
})

const getCourseById = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
        where: {
            id: id
        }
    });

    if(!course){
        throw new ApiError(404, "Course not found");
    }

    res.status(200).json(new ApiResponse(200, course, "Course fetched successfully"));
})

export { createCourse, deleteCourse, updateCourse, getAllCourse, getCourseById };