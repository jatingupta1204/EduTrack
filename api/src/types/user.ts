import { StudentStatus } from "@prisma/client";

export interface JWTUserPayload {
    _id: string;
    email: string;
    username: string;
}

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    role: string;
    departmentId: string;
    first_name: string;
    last_name: string;
    admissionYear: number;
    currentSemester: number;
    batchId: string;
    status: StudentStatus;
}

export interface changeUserInfo {
    username: string;
    email: string;
    password: string;
    role: string;
    departmentId: string;
    first_name: string;
    last_name: string;
    currentSemester: number;
    batchId: string;
    status: StudentStatus;
}

export interface LoginUser{
    username: string;
    password: string;
}