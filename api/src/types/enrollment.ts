export interface CreateEnrollmentInput {
    studentId: string;
    teacherId: string;
    courseId: string;
    semesterId: string;
    totalClasses: number;
    attendedClasses: number;
    absentClasses: number;
}