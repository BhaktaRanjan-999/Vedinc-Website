import express from "express";
import multer from "multer";
import { authenticate } from "../../middlewares/auth.middleware";
import {
    getMyProfileController,
    updateMyProfileController,
} from "./user.controller";

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.get("/me", authenticate, getMyProfileController);

router.put(
    "/me",
    authenticate,
    upload.single("avatar"),
    updateMyProfileController
);

export default router;