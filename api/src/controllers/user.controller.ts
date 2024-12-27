import { Request, Response } from "express";
import { changeAvatar, changePassword, CreateUser, login, refreshedToken } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateUserInput, LoginUser } from "../types";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";


const registerUser = asyncHandler(async(req: Request, res: Response) => {
    const input : CreateUserInput = req.body;

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const newUser = await CreateUser(input, avatarLocalPath);

    const { password, refreshToken, ...createdUser } = newUser;

    res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
})

const loginUser = asyncHandler(async(req: Request, res: Response) => {
    const input : LoginUser = req.body;

    const loggedUser = await login(input);

    const option = {
        httpOnly: true,
        secure: true
    };

    res.status(200).cookie("accessToken", loggedUser.accessToken, option).cookie("refreshToken", loggedUser.refreshToken, option).json(
        new ApiResponse(200, "User Logged In Successfully")
    );
})

const logoutUser = asyncHandler(async(req: Request, res: Response) => {
    const userId = req.user?.id;
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            refreshToken: null
        }
    });

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const { accessToken, refreshToken } = await refreshedToken(incomingRefreshToken);
        
        const option = {
            httpOnly: true,
            secure: true
        };

        res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(new ApiResponse(200, {}, "Access Token Refreshed"))
    } catch (error) {
        throw new ApiError(401, "Invalid Refresh token");
    }
})

const updatePassword = asyncHandler(async(req: Request, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    const userId = req.user?.id;

    if(!userId){
        throw new ApiError(401, "Unauthorized Request");
    }

    await changePassword(oldPassword, newPassword, userId);

    res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully"));
})

const updateAvatar = asyncHandler(async(req: Request, res: Response) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is missing");
    }

    const userId = req.user?.id;

    if(!userId){
        throw new ApiError(401, "Unauthorized Request");
    }

    await changeAvatar(avatarLocalPath, userId);

    res.status(200).json(new ApiResponse(200, {}, "Avatar Updated Successfully"));
})

const deleteUser = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;
    
    await prisma.user.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(new ApiResponse(200, {}, "User Deleted Successfully"));
})

const getAllUser = asyncHandler(async(req: Request, res: Response) => {
    const user = await prisma.user.findMany({
        select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            created_at: true,
            updated_at: true
        }
    });

    res.status(200).json(new ApiResponse(200, user, "Users fetched Successfully"));
})

const getUserById = asyncHandler(async(req: Request, res: Response) => {
    const {id} = req.params;

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched Successfully"));
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, updatePassword, updateAvatar, deleteUser, getAllUser, getUserById };