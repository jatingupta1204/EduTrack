import { prisma } from "..";
import { createGradeInput } from "../types";
import { ApiError } from "../utils/ApiError";


const giveGrade = async(input: createGradeInput, userId: string) => {
    const { enrollmentId, grade } = input;

    if(!enrollmentId || !grade || !userId ){
        throw new ApiError(400, "All fields are required");
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId
        }
    });

    if(!enrollment){
        throw new ApiError(404, "Enrolled Student not found");
    }

    const existingGrade = await prisma.grade.findFirst({
        where: {
            enrollmentId: enrollmentId,
            grade,
        }
    });

    if(existingGrade){
        throw new ApiError(409, "Grade already given");
    }

    const grades = await prisma.grade.create({
        data: {
            enrollmentId,
            grade,
            gradedById: userId
        }
    });

    const gradeGiven = await prisma.grade.findUnique({
        where: {
            id: grades.id
        }
    });

    if(!gradeGiven){
        throw new ApiError(500, "Something went wrong while giving grades");
    }

    return gradeGiven;
}

const changeGrade = async(grade: string, id: string) => {
    const grades = await prisma.grade.findUnique({
        where: {
            id: id
        }
    });

    if(!grades){
        throw new ApiError(401, "Grade not found")
    }

    const updatedGrade = await prisma.grade.update({
        where: {
            id: id
        },
        data: {
            grade
        }
    })

    return updatedGrade;
}

export { giveGrade, changeGrade }