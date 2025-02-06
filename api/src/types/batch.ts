export interface createBatchInput {
    departmentId: string;
    semesterId: string;
    name: string;
    schedule_info: Record<string, any>;
    coordinatorId: string;
}