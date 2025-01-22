import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createAcademicYear, deleteAcademicYear, getAcademicYearById, getAllAcademicYear, updateAcademicYear } from "../controllers/academicYear.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createAcademicYear);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteAcademicYear);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateAcademicYear);
router.route("/getAllAcademicYear").get(getAllAcademicYear);
router.route("/getSingleAcademicYear/:id").get(getAcademicYearById);

export default router;