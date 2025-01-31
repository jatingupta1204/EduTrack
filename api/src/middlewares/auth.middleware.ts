import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "..";
import { NextFunction, Request, Response } from "express";
import { JWTUserPayload } from "../types";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                username: string;
            };
        }
    }
}

export const verifyJWT = asyncHandler(async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token){
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET) as JWTUserPayload;
        
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken._id
            }
        }); 

        if(!user){
            throw new ApiError(401, "Invalid access token")
        }

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username
        };
        next();
    } catch (error) {
        throw new ApiError(401, "JWT Verification Error: Invalid access token");
    }
})

export const verifySuperAdmin = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }
    });

    if(!user || user.role !== "SuperAdmin"){
        throw new ApiError(401, "Invalid access: User is not an SuperAdmin");
    }
    req.user = user;
    next()
})

export const verifyAdmin = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }
    });

    if(!user || (user.role !== "SuperAdmin" && user.role !== "Admin")){
        throw new ApiError(401, "Invalid access: User is not an Admin or SuperAdmin");
    }
    req.user = user;
    next()
})