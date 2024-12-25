export interface JWTUserPayload {
    id: string;
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