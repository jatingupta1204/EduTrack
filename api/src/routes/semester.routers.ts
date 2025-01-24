import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createSemester, deleteSemester, getAllSemester, getSemesterById, updateSemester } from "../controllers/semester.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createSemester);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteSemester);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateSemester);
router.route("/getAllSemester").get(getAllSemester);
router.route("/getSingleSemester/:id").get(getSemesterById);

export default router;