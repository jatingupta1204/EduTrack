import { Router } from "express";
import { createNotice, deleteNotice, getAllNotice, getNoticeById, updateNotice } from "../controllers/notice.controller";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";

const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin ,createNotice);
router.route("/delete/:id").delete(verifyJWT ,verifySuperAdmin, deleteNotice);
router.route("/update/:id").put(verifyJWT ,verifySuperAdmin, updateNotice);
router.route("/getAllNotice").get(getAllNotice);
router.route("/getSingleNotice/:id").get(getNoticeById);

export default router;