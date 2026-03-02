import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
    getMyProfileController,
    updateMyProfileController,
} from "./profile.controller";

const router = Router();

router.get("/me", authenticate, getMyProfileController);
router.patch("/me", authenticate, updateMyProfileController);

export default router;