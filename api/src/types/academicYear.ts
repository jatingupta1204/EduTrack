import { AcademicStatus } from "@prisma/client";

export interface createAcademicYearInput {
    id: string;
    year: string;
    startDate: Date;
    endDate: Date;
    status: AcademicStatus
}