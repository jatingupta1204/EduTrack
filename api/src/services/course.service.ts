import { prisma } from "..";
import { changeCourseInfo, CreateCourseInput } from "../types";
import { ApiError } from "../utils/ApiError";


const addCourse = async(input: CreateCourseInput) => {
    const { departmentId, credits, lecture_classes, tutorial_classes, practical_classes, title, description, semesterNumber, code } = input;

    if(!title || !description || !code || !semesterNumber || !departmentId || credits === undefined || lecture_classes === undefined || tutorial_classes === undefined || practical_classes === undefined){
        throw new ApiError(400, "All fields are required");
    }

    const exisitingCourse = await prisma.course.findUnique({
        where: {
            code
        }
    });

    if(exisitingCourse){
        throw new ApiError(409, "Course already exists");
    }

    const course = await prisma.course.create({
        data: {
            departmentId,
            code,
            title,
            description,
            credits,
            lecture_classes,
            tutorial_classes,
            practical_classes,
            semesterNumber
        }
    });
    
    const createdCourse = await prisma.course.findUnique({
        where: {
            id: course.id,
        }
    });

    if(!createdCourse){
        throw new ApiError(500, "Something went wrong while creating course");
    }

    return createdCourse;
}

const changeCourse = async(input: changeCourseInfo, id: string) => {
    const course = await prisma.course.findUnique({
        where: {
            id
        }
    });

    if(!course){
        throw new ApiError(401, "Course not found")
    }

    const filteredData = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => value !== undefined && value !== null)
    );

    if (Object.keys(filteredData).length === 0) {
        throw new ApiError(400, "No valid fields to update");
    }

    const updatedCouse = await prisma.course.update({
        where: {
            id: id
        },
        data: filteredData
    });

    return updatedCouse;
}

export { addCourse, changeCourse }