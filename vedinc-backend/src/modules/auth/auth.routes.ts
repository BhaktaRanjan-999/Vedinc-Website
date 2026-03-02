import { Router } from "express";
import { login, signup } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, signupSchema } from "../../validator/auth.schema";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);

export default router;