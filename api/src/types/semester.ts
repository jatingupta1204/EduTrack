import { AcademicStatus, SemesterType } from "@prisma/client";

export interface createSemesterInput {
    academicYear: number;
    type: SemesterType;
    number: number;
    startDate: Date;
    endDate: Date;
    registrationStart: Date;
    registrationEnd: Date;
    status: AcademicStatus;
}

export interface changeSemesterInfo {
    academicYear: number;
    startDate: Date;
    endDate: Date;
    registrationStart: Date;
    registrationEnd: Date;
    status: AcademicStatus;
}