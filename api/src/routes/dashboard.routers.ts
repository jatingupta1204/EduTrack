import { Router } from "express";
import { getDashboardStats, getPlatformUsageOverTime, getRecentActivities } from "../controllers/dashboard.controller";


const router = Router()

router.route("/stats").get(getDashboardStats);
router.route("/activity/getRecent").get(getRecentActivities);
router.route("/platformUsage").get(getPlatformUsageOverTime);

export default router;