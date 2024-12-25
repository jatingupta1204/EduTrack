import { prisma } from "..";
import fs from "fs";
import { CreateUserInput } from "../types";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { hashpassword } from "../utils/password";

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

export { CreateUser }