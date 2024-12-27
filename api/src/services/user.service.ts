import { prisma } from "..";
import fs from "fs";
import { CreateUserInput, JWTUserPayload, LoginUser } from "../types";
import { ApiError } from "../utils/ApiError";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { hashpassword, verifyPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";

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

const CreateUser = async(input: CreateUserInput, avatarLocalPath?: string) => {
    const {fullname, username, email, password} = input;

    if(!username || !email || !password){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if(existingUser){
        if (avatarLocalPath && fs.existsSync(avatarLocalPath)) {
            fs.unlinkSync(avatarLocalPath);
        }
        throw new ApiError(409, "User already exists");
    }

    let avatarUrl = "";
    if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiError(500, "Failed to upload avatar to Cloudinary");
        }

        avatarUrl = avatar.url;
    }

    const hashedPassword = await hashpassword(password);

    const user = await prisma.user.create({data : {
        fullname,
        username,
        email,
        password: hashedPassword,
        avatar: avatarUrl
    }});

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

    return { accessToken, refreshToken };
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

export { CreateUser, login, refreshedToken, changePassword, changeAvatar }