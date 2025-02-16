import { Request, Response } from "express";
import { changeAvatar, changePassword, changeUser, CreateUser, login, multiUser, refreshedToken } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { changeUserInfo, CreateUserInput, LoginUser } from "../types";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "..";

const registerUser = asyncHandler(async(req: Request, res: Response) => {
    const input : CreateUserInput = req.body;

    const newUser = await CreateUser(input);

    const { password, refreshToken, ...createdUser } = newUser;

    res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
})

const bulkCreate = asyncHandler(async (req: Request, res: Response) => {
    const { users } = req.body;

    const bulkUser = await multiUser(users);

    if (bulkUser.status === "error") {
        res.status(400).json(new ApiResponse(400, { skippedEmails: bulkUser.existingEmails }, bulkUser.message));
        return;
    }

    res.status(201).json(new ApiResponse(201, { createdCount: bulkUser.createdCount, skippedEmails: bulkUser.skippedEmails }, bulkUser.message));
});

const updateUser = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    const input: changeUserInfo = req.body;

    const user = await changeUser(id, input);

    const { ...updatedUser } = user;

    res.status(200).json(new ApiResponse(200, updatedUser, "User Updated Successfully"));
})

const loginUser = asyncHandler(async(req: Request, res: Response) => {
    const input : LoginUser = req.body;

    const loggedUser = await login(input);

    const option = {
        httpOnly: true,
        secure: true
    };

    res.status(200).cookie("accessToken", loggedUser.accessToken, option).cookie("refreshToken", loggedUser.refreshToken, option).json(
        new ApiResponse(200, { role: loggedUser.user.role } ,"User Logged In Successfully")
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const paginate = req.query.paginate === "false" ? false : true;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findMany({
        ...(paginate ? { select: {
            id: true,
            first_name: true,
            last_name: true,
            username: true,
            email: true,
            avatar: true,
            role: true,
            departmentId: true,
            admissionYear: true,
            currentSemester: true,
            status: true,
            batchId: true,
            created_at: true,
            updated_at: true
        }, skip, take: limit} : {})
        
    });

    const totalUsers = await prisma.user.count();
    const totalPages = paginate ? Math.ceil(totalUsers / limit) : 1;

    res.status(200).json(new ApiResponse(200, {user, totalPages, limit}, "Users fetched Successfully"));
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

export { registerUser, bulkCreate, updateUser, loginUser, logoutUser, refreshAccessToken, updatePassword, updateAvatar, deleteUser, getAllUser, getUserById };