import { prisma } from "..";
import { createDepartmentInput } from "../types/department";
import { ApiError } from "../utils/ApiError";


const addDepartment = async(input: createDepartmentInput) => {
    const { name, code, description, schoolId } = input;

    if(!name || !code || !description || !schoolId){
        throw new ApiError(400, "All fields are required")
    }

    const existingSchool = await prisma.school.findUnique({
        where: {
            id: schoolId
        }
    });

    if(!existingSchool){
        throw new ApiError(404, "School not found");
    }

    const existingDepartment = await prisma.department.findUnique({
        where: {
            code: code
        }
    })

    if(existingDepartment){
        throw new ApiError(409, "Department already exists");
    }

    const department = await prisma.department.create({
        data: {
            name,
            code,
            description,
            schoolId
        }
    })

    const createdDepartment = await prisma.department.findUnique({
        where: {
            id: department.id
        }
    })

    if(!createdDepartment){
        throw new ApiError(500, "Something went wrong while creating department")
    }

    return createdDepartment;
}

const changeDepartment = async(id: string, name?: string, description?: string, schoolId?: string) => {
    const department = await prisma.department.findUnique({
        where: {
            id: id
        }
    })

    if(!department){
        throw new ApiError(401, "Department not found");
    }
    
    const updatedDepartment = await prisma.department.update({
        where: {
            id: id
        },
        data: {
            name, 
            description,
            schoolId
        }
    })

    return updatedDepartment
}

export { addDepartment, changeDepartment }