import { AcademicStatus } from "@prisma/client";
import { prisma } from "..";
import { createAcademicYearInput } from "../types/academicYear";
import { ApiError } from "../utils/ApiError";


const addAcademicYear = async(input: createAcademicYearInput) => {
    const { year, startDate, endDate, status } = input;

    if(!year || !startDate || !endDate || !status){
        throw new ApiError(400, "All fields are required")
    }

    const existingAcademicYear = await prisma.academicYear.findUnique({
        where: {
            year: year
        }
    })

    if(existingAcademicYear){
        throw new ApiError(409, "Academic Year already exists");
    }

    const academicYear = await prisma.academicYear.create({
        data: {
            year,
            startDate,
            endDate,
            status: status as AcademicStatus,
        }
    })

    const createdAcademicYear = await prisma.academicYear.findUnique({
        where: {
            id: academicYear.id
        }
    })

    if(!createdAcademicYear){
        throw new ApiError(500, "Something went wrong while creating academic year")
    }

    return createdAcademicYear;
}

const changeAcademicYear = async(id: string, startDate?: Date, endDate?: Date, status?: AcademicStatus) => {
    const academicYear = await prisma.academicYear.findUnique({
        where: {
            id: id
        }
    })

    if(!academicYear){
        throw new ApiError(401, "Academic Year not found");
    }

    const updatedAcademicYear = await prisma.academicYear.update({
        where: {
            id: id
        },
        data: {
            startDate,
            endDate,
            status: status as AcademicStatus
        }
    })

    return updatedAcademicYear;
}

export { addAcademicYear, changeAcademicYear }