import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
    listCoursesController,
    getCourseContentController,
} from "./course.controller";

const router = Router();

router.get("/", authenticate, listCoursesController);

router.get("/:id", authenticate, getCourseContentController);

export default router;
