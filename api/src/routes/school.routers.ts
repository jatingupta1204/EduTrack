import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createSchool, deleteSchool, getAllSchool, getSchoolById, updateSchool } from "../controllers/school.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createSchool);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteSchool);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateSchool);
router.route("/getAllCourse").get(getAllSchool);
router.route("/getSingleCourse/:id").get(getSchoolById);

export default router;