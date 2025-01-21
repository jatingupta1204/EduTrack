import { prisma } from "..";
import { createSchoolInput } from "../types";
import { ApiError } from "../utils/ApiError";


const addSchool = async(input:createSchoolInput) => {
    const { name, code, description } = input;

    if(!name || !code || !description){
        throw new ApiError(400, "All fields are required");
    }

    const existingSchool = await prisma.school.findUnique({
        where: {
            code: code
        }
    });

    if(existingSchool){
        throw new ApiError(409, "School Already Exists");
    }

    const school = await prisma.school.create({
        data: {
            name,
            code,
            description
        }
    });

    const createdSchool = await prisma.school.findUnique({
        where: {
            id: school.id
        }
    });

    if(!createdSchool){
        throw new ApiError(500, "Something went wrong while creating school");
    }

    return createdSchool;
}

const changeSchool = async(id: string, name?: string, description?: string) => {
    const school = await prisma.school.findUnique({
        where: {
            id: id
        }
    })

    if(!school){
        throw new ApiError(401, "School not found");
    }

    const updatedSchool = await prisma.school.update({
        where: {
            id: id
        },
        data: {
            name,
            description
        }
    })

    return updatedSchool
}

export { addSchool, changeSchool }