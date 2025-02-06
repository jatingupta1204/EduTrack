import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { enrollStudent, getAllEnrollment, getEnrollmentById, unenrollStudent } from "../controllers/enrollment.controller";


const router = Router()

router.route("/enroll").post(verifyJWT, enrollStudent);
router.route("/unenroll/:id").delete(verifyJWT, verifySuperAdmin, unenrollStudent);
router.route("/getAllEnrollment").get(getAllEnrollment);
router.route("/getSingleEnrollment/:id").get(getEnrollmentById);

export default router;