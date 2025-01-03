import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createCourse, deleteCourse, getAllCourse, getCourseById, updateCourse } from "../controllers/course.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createCourse);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteCourse);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateCourse);
router.route("/getAllCourse").get(getAllCourse);
router.route("/getSingleCourse/:id").get(getCourseById);

export default router;