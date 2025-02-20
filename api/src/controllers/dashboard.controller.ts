import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "..";
import { ApiResponse } from "../utils/ApiResponse";

// Route to get dashboard stats
const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const schools = await prisma.school.count();
    const departments = await prisma.department.count();
    const courses = await prisma.course.count();
    const students = await prisma.user.count({
        where: {
            role: "Student"
        },
    });

    res.status(200).json(new ApiResponse(200, { schools, departments, courses, students }, "Stats Fetched Successfully"));
});

// Route to get recent activities
const getRecentActivities = asyncHandler(async (req: Request, res: Response) => {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: {
                created_at: 'desc',
            },
            take: 5, // Limit to 5 latest activities
            include: {
                user: {
                    select: {
                        username: true, // Assuming user has a 'username' field
                    }
                }
            }
        });

        if (activities.length > 0) {
            res.status(200).json(new ApiResponse(200, activities, "Activities fetched successfully"));
        } else {
            // Return a 200 response even when no activities are found, but indicate this in the message
            res.status(200).json(new ApiResponse(200, [], "No recent activities found"));
        }
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json(new ApiResponse(500, null, "Error fetching activities"));
    }
});

// Route to get platform usage over time (DAU, WAU, MAU)
const getPlatformUsageOverTime = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        // Convert to Date objects
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        const activityStats = await prisma.activity.groupBy({
            by: ['created_at'],
            _count: {
                created_at: true
            },
            where: {
                created_at: {
                    gte: start,
                    lt: end,
                },
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        const formattedStats = activityStats.map((stat) => ({
            date: stat.created_at.toISOString().split("T")[0],  // Format date to 'YYYY-MM-DD'
            users: stat._count.created_at,
        }));

        res.status(200).json(new ApiResponse(200, formattedStats, "Platform usage fetched successfully"));
    } catch (error) {
        console.error("Error fetching platform usage:", error);
        res.status(500).json(new ApiResponse(500, null, "Error fetching platform usage"));
    }
});

// Example function to log an activity
const logActivity = async (userId: string, description: string, activityType: string) => {
    try {
        await prisma.activity.create({
            data: {
                userId,
                description,
                activityType,
            }
        });
    } catch (error) {
        console.error("Error logging activity:", error);
        throw new Error("Error logging activity");  // Throw error for handling elsewhere
    }
};

export { getDashboardStats, getRecentActivities, getPlatformUsageOverTime };