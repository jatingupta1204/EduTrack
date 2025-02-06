import { prisma } from "..";
import { createBatchInput } from "../types";
import { ApiError } from "../utils/ApiError";


const addBatch = async(input: createBatchInput) => {
    const { departmentId, semesterId, name, schedule_info, coordinatorId } = input;

    if(!departmentId || !semesterId || !name || !coordinatorId){
        throw new ApiError(400, "All fields are required")
    }

    const existingBatch = await prisma.batch.findUnique({
        where: {
            name: name
        }
    })

    if(existingBatch){
        throw new ApiError(409, "Batch Already Exists");
    }

    const batch = await prisma.batch.create({
        data: {
            departmentId,
            semesterId,
            name,
            schedule_info,
            coordinatorId
        }
    })

    const createdBatch = await prisma.batch.findUnique({
        where: {
            id: batch.id
        }
    })

    if(!createdBatch){
        throw new ApiError(500, "Something went wrong while creating batch");
    }

    return createdBatch
}

const changeBatch = async(id: string, semesterId?: string, schedule_info?: Record<string, any>, coordinatorId?: string) => {
    const existingBatch = await prisma.batch.findUnique({
        where: {
            id: id
        }
    })

    if(!existingBatch){
        throw new ApiError(401, "Batch Not Found");
    }

    const updatedBatch = await prisma.batch.update({
        where: {
            id: id
        },
        data: {
            semesterId,
            schedule_info,
            coordinatorId
        }
    });

    return updatedBatch
}

export { addBatch, changeBatch }