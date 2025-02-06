export interface CreateCourseInput{
    departmentId: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    lecture_classes: number;
    tutorial_classes: number;
    practical_classes: number;
    semesterNumber: number;
}

export interface changeCourseInfo {
    description: string;
    credits: number;
    lecture_classes: number;
    tutorial_classes: number;
    practical_classes: number;
    semesterNumber: number;
}