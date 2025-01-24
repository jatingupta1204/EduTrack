import { AcademicStatus, SemesterType } from "@prisma/client";

export interface createSemesterInput {
    id: string;
    academicYearId: string;
    type: SemesterType;
    number: number;
    startDate: Date;
    endDate: Date;
    registrationStart: Date;
    registrationEnd: Date;
    status: AcademicStatus;
}

export interface changeSemesterInfo {
    id: string;
    academicYearId: string;
    startDate: Date;
    endDate: Date;
    registrationStart: Date;
    registrationEnd: Date;
    status: AcademicStatus;
}