export interface JWTUserPayload {
    _id: string;
    email: string;
    username: string;
}

export interface CreateUserInput {
    fullname: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
}

export interface LoginUser{
    username: string;
    password: string;
}