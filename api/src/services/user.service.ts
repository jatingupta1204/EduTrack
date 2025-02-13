import { prisma } from "..";
import fs from "fs";
import { changeUserInfo, CreateUserInput, JWTUserPayload, LoginUser } from "../types";
import { ApiError } from "../utils/ApiError";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { hashpassword, verifyPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";
import { StudentStatus } from "@prisma/client";

const generateAccessandRefreshToken = async(userid: string) =>{
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userid
            }
        });

        if(!user){
            throw new ApiError(404, "User not found");
        }
        
        const payload: JWTUserPayload = {
            _id: user.id,
            email: user.email,
            username: user.username,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: refreshToken
            }
        });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const CreateUser = async(input: CreateUserInput) => {
    const {username, email, password, role, departmentId, first_name, last_name, admissionYear, currentSemester, batchId, status} = input;

    if(!username || !email || !password || !first_name || !last_name){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        },
    });

    if(existingUser){
        throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await hashpassword(password);

    const userData : any = {
        username,
        email,
        password: hashedPassword,
        role,
        first_name,
        last_name,
        departmentId,
        admissionYear,
        currentSemester,
        batchId,
        status: status as StudentStatus
    }

    if(role){
        userData.role = role;
    }

    const user = await prisma.user.create({ data: userData });

    const createdUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        }
    });

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return createdUser;
}

const multiUser = async (users: any[]) => {
    if (!Array.isArray(users) || users.length === 0) {
        throw new ApiError(400, "Invalid or empty user data");
    }

    const userEmails = users.map(user => user.email);

    const existingUsers = await prisma.user.findMany({
        where: {
            email: { in: userEmails }
        },
        select: { email: true }
    });

    const existingEmails = existingUsers.map(user => user.email);

    const newUsers = users.filter(user => !existingEmails.includes(user.email));

    if (newUsers.length === 0) {
        return {
            status: "error",
            message: "All users already exist in the system.",
            existingEmails
        };
    }

    const formattedUsers = await Promise.all(newUsers.map(async (user) => ({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        password: await hashpassword(user.password),
        role: user.role || "Student",
        departmentId: user.departmentId || null,
        admissionYear: user.admissionYear || null,
        currentSemester: user.currentSemester || null,
        batchId: user.batchId || null,
    })));

    const createdUsers = await prisma.user.createMany({
        data: formattedUsers,
        skipDuplicates: true
    });

    return {
        status: "success",
        createdCount: createdUsers.count,
        skippedEmails: existingEmails,
        message: `${createdUsers.count} users created successfully, ${existingEmails.length} were skipped (already exist).`
    };
};

const changeUser = async(id: string, input: changeUserInfo) => {
    const { ...data }  = input;

    const existingUser = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if(!existingUser){
        throw new ApiError(401, "User Not Found");
    }

    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
    );

    const updatedUser = await prisma.user.update({
        where: {
            id: id
        },
        data: filteredData
    });

    return updatedUser;
}

const login = async(input: LoginUser) => {
    const {username, password} = input;

    if(!username){
        throw new ApiError(400, "Username is Required")
    }

    const user = await prisma.user.findFirst({
        where: {
            username
        }
    });

    if(!user){
        throw new ApiError(404, "User does not exists")
    }

    const validatePassword = await verifyPassword(user.password, password);

    if(!validatePassword){
        throw new ApiError(401, "Invalid User Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user.id)

    return { accessToken, refreshToken, user };
}

const refreshedToken = async(incomingRefreshToken: string) => {
    const decodedToken = jwt.verify(incomingRefreshToken, <string>process.env.REFRESH_TOKEN_SECRET) as JWTUserPayload;
    
    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken._id
        }
    });

    if(!user){
        throw new ApiError(401, "Invalid Refresh Token");
    }
    
    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used");
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user.id);

    return {accessToken, refreshToken};
}

const changePassword = async(oldPassword: string, newPassword:string, userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    
    if(!user){
        throw new ApiError(401, "Unauthorized Request");
    }

    const validatePassword = await verifyPassword(user.password, oldPassword);

    if(!validatePassword){
        throw new ApiError(401, "Invalid old password");
    }

    const hashedPassword = await hashpassword(newPassword);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword
        }
    })
}

const changeAvatar = async(path: string, userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user){
        throw new ApiError(401, "Unauthorized Request")
    }

    if (user.avatar) {
        const publicId = user.avatar.split('/').pop()?.split('.')[0];
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    const avatar = await uploadOnCloudinary(path);

    if(!avatar?.url){
        throw new ApiError(400, "Error while uploading avatar on cloudinary");
    }

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            avatar: avatar.url
        }
    });
}

export { CreateUser, multiUser, login, refreshedToken, changePassword, changeAvatar, changeUser }