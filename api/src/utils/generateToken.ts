import jwt from "jsonwebtoken";
import { JWTUserPayload } from "../types";



function generateAccessToken(user: JWTUserPayload): string {
    return jwt.sign(
        {
            _id: user.id,
            email: user.email,
            username: user.username
        },
        <string>process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: <string>process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

function generateRefreshToken(user: JWTUserPayload): string {
    return jwt.sign(
        {
            _id: user.id,
        },
        <string>process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: <string>process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export { generateAccessToken, generateRefreshToken }