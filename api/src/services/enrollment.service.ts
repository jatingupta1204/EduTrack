import { prisma } from "..";
import { CreateEnrollmentInput } from "../types";
import { ApiError } from "../utils/ApiError";


const enrollment = async(input: CreateEnrollmentInput, userId: string) => {
    const { courseId, enrollmentDate } = input

    if(!courseId){
        throw new ApiError(400, "All fields are required");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });

    if(!course){
        throw new ApiError(404, "Course not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const alreadyEnrolled = await prisma.enrollment.findFirst({
        where: {
            userId: userId,
            courseId: courseId,
        }
    })

    if(alreadyEnrolled){
        throw new ApiError(409, "Enrollment already done");
    }

    const enroll = await prisma.enrollment.create({
        data: {
            userId,
            courseId,
            enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date()
        }
    })
    
    const enrolled = await prisma.enrollment.findUnique({
        where: {
            id: enroll.id
        }
    });

    if(!enrolled){
        throw new ApiError(500, "Something went wrong while enrolling the student");
    }

    return enrolled;
}

export{ enrollment };