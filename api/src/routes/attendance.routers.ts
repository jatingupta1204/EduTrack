import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware";
import { createAttendance, deleteAttendance, getAllAttendance, getAttendanceById, updateAttendance } from "../controllers/attendance.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifyAdmin, createAttendance);
router.route("/delete/:id").delete(verifyJWT, verifyAdmin, deleteAttendance);
router.route("/update/:id").put(verifyJWT, verifyAdmin, updateAttendance);
router.route("/getAllAttendance").get(verifyJWT, getAllAttendance);
router.route("/getSingleAttendance/:id").get(verifyJWT, getAttendanceById);

export default router;