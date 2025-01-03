import { prisma } from "..";
import { CreateNoticeInput } from "../types/index";
import { ApiError } from "../utils/ApiError";


const addNotice = async(input: CreateNoticeInput) => {
    const {title, description, date} = input
    
    if(!title || !description){
        throw new ApiError(400, "All fields are required");
    }

    const exisitngNotice = await prisma.notice.findUnique({
        where: {
            title: title
        },
    });

    if(exisitngNotice){
        throw new ApiError(409, "Notice already exists");
    }

    const notice = await prisma.notice.create({
        data: {
            title,
            description,
            date: date ? new Date(date) : new Date()
        }
    })
    
    const createdNotice = await prisma.notice.findUnique({
        where: {
            id: notice.id,
        }
    });

    if(!createdNotice){
        throw new ApiError(500, "Something went wrong while creating notice");
    }

    return createdNotice;
}

const changeNotice = async(description: string, id: string) => {
    const notice = await prisma.notice.findUnique({
        where: {
            id: id
        }
    })
    
    if(!notice){
        throw new ApiError(401, "Notice not found")
    }

    const updatedNotice = await prisma.notice.update({
        where: {
            id: id
        },
        data: {
            description
        }
    })

    return updatedNotice;
}

export { addNotice, changeNotice };