import { prisma } from "..";
import { CreateEnrollmentInput } from "../types";
import { ApiError } from "../utils/ApiError";


const enrollment = async(input: CreateEnrollmentInput, userId: string) => {
    const { teacherId, courseId, semesterId, totalClasses, attendedClasses, absentClasses } = input

    if(!teacherId || !courseId || !semesterId || totalClasses === undefined || attendedClasses === undefined || absentClasses === undefined){
        throw new ApiError(400, "All fields are required");
    }

    const attendancePercentage = (attendedClasses / totalClasses) * 100;

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
            studentId: userId,
            courseId,
        }
    })

    if(alreadyEnrolled){
        throw new ApiError(409, "Enrollment already done");
    }

    const enroll = await prisma.enrollment.create({
        data: {
            studentId: userId,
            teacherId,
            courseId,
            semesterId,
            totalClasses,
            attendedClasses,
            absentClasses,
            attendancePercentage,
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