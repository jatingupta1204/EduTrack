import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createDepartment, deleteDepartment, getAllDepartment, getDepartmentById, updateDepartment } from "../controllers/department.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createDepartment);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteDepartment);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateDepartment);
router.route("/getAllCourse").get(getAllDepartment);
router.route("/getSingleCourse/:id").get(getDepartmentById);

export default router;