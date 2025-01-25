import { Router } from "express";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware";
import { createBatch, deleteBatch, getAllBatch, getBatchById, updateBatch } from "../controllers/batch.controller";


const router = Router()

router.route("/create").post(verifyJWT, verifySuperAdmin, createBatch);
router.route("/delete/:id").delete(verifyJWT, verifySuperAdmin, deleteBatch);
router.route("/update/:id").put(verifyJWT, verifySuperAdmin, updateBatch);
router.route("/getAllBatch").get(getAllBatch);
router.route("/getSingleBatch/:id").get(getBatchById);

export default router;