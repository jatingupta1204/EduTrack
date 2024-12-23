import * as argon2 from "argon2";

export async function hashpassword(password:string) {
    return await argon2.hash(password);
}

export async function verifyPassword(hash:string, password:string) {
    return await argon2.verify(hash, password);
}