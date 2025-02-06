import { AcademicStatus, SemesterType } from "@prisma/client";
import { prisma } from "..";
import { changeSemesterInfo, createSemesterInput } from "../types";
import { ApiError } from "../utils/ApiError";


const addSemester = async(input: createSemesterInput) => {
    const { academicYear, type, number, startDate, endDate, registrationStart, registrationEnd, status } = input;

    if(!academicYear || !type || !number|| !startDate || !endDate || !registrationStart || !registrationEnd || !status){
        throw new ApiError(400, "All fields are required");
    }

    const existingSemester = await prisma.semester.findUnique({
        where: {
            number: number
        }
    })

    if(existingSemester){
        throw new ApiError(409, "Semester Already Exists");
    }

    const semester = await prisma.semester.create({
        data: {
            academicYear,
            type: type as SemesterType,
            number,
            startDate,
            endDate,
            registrationStart,
            registrationEnd,
            status: status as AcademicStatus
        }
    });

    const createdSemester = await prisma.semester.findUnique({
        where: {
            id: semester.id
        }
    });

    if(!createdSemester){
        throw new ApiError(500, "Something went wrong while creating semester");
    }

    return createdSemester;
}

const changeSemester = async(id: string, input: changeSemesterInfo) => {
    const { ...data }  = input;

    const existingSemester = await prisma.semester.findUnique({
        where: {
            id: id
        }
    })

    if(!existingSemester){
        throw new ApiError(401, "Semester Not Found");
    }

    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
    );

    const updatedSemester = await prisma.semester.update({
        where: {
            id: id
        },
        data: filteredData
    });

    return updatedSemester;
}


export { addSemester, changeSemester }