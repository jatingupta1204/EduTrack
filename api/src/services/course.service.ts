import { prisma } from "..";
import { CreateCourseInput } from "../types";
import { ApiError } from "../utils/ApiError";


const addCourse = async(input: CreateCourseInput) => {
    const { title, description } = input;

    if(!title || !description){
        throw new ApiError(400, "All fields are required");
    }

    const exisitngCourse = await prisma.course.findUnique({
        where: {
            title: title
        }
    });

    if(exisitngCourse){
        throw new ApiError(409, "Course already exists");
    }

    const course = await prisma.course.create({
        data: {
            title,
            description
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

const changeCourse = async(description: string, id: string) => {
    const course = await prisma.course.findUnique({
        where: {
            id: id
        }
    });

    if(!course){
        throw new ApiError(401, "Notice not found")
    }

    const updatedCouse = await prisma.course.update({
        where: {
            id: id
        },
        data: {
            description
        }
    });

    return updatedCouse;
}

export { addCourse, changeCourse }