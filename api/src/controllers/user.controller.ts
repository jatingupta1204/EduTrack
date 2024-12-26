import { Request, Response } from "express";
import { CreateUser, login } from "../services/user.service";
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
});

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

const updateUser = asyncHandler(async(req: Request, res: Response) => {

})

export { registerUser, loginUser, logoutUser };