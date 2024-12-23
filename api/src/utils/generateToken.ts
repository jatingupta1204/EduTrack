import jwt from "jsonwebtoken";

interface User {
    id: string;
    email: string;
    username: string;
    fullname: string;
}

function generateAccessToken(user: User): string {
    return jwt.sign(
        {
            _id: user.id,
            email: user.email,
            username: user.username,
            fullname: user.fullname
        },
        <string>process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: <string>process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

function generateRefreshToken(user: User): string {
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