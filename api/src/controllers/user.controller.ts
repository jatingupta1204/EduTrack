import { Request, Response } from "express";
import { CreateUser } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateUserInput } from "../types";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";


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

export {registerUser};