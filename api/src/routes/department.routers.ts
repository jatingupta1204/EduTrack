import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createDepartment, deleteDepartment, getAllDepartment, getDepartmentById, updateDepartment } from "../controllers/department.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createDepartment);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteDepartment);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateDepartment);
router.route("/getAllDepartment").get(getAllDepartment);
router.route("/getSingleDepartment/:id").get(getDepartmentById);

export default router;