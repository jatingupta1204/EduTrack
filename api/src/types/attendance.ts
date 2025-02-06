import { AttendanceStatus } from "@prisma/client";

export interface CreateAttendanceInput {
    enrollmentId: string;
    status: AttendanceStatus;
}