import { Router } from "express";
import { bulkCreate, deleteUser, getAllUser, getUserById, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updatePassword, updateUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()

router.route("/register").post(registerUser);
router.route("/bulkCreate").post(bulkCreate);
router.route("/update/:id").put(updateUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-password").put(verifyJWT, updatePassword);
router.route("/update-avatar/:id").put(verifyJWT, upload.single(("avatar")), updateAvatar);
router.route("/delete/:id").delete(deleteUser);
router.route("/getAllUser").get(getAllUser);
router.route("/getSingleUser").get(verifyJWT, getUserById);

export default router