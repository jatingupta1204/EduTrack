import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware";
import { createGrade, deleteGrade, getAllGrade, getGradeById, updateGrade } from "../controllers/grade.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifyAdmin, createGrade);
router.route("/delete/:id").delete(verifyJWT, verifyAdmin, deleteGrade);
router.route("/update/:id").put(verifyJWT, verifyAdmin, updateGrade);
router.route("/getAllGrade").get(verifyJWT, getAllGrade);
router.route("/getSingleGrade/:id").get(verifyJWT, getGradeById);

export default router;