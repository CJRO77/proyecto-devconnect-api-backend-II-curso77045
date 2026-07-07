import { Router } from "express";
import {
    login,
    logout,
    current
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/current", authMiddleware, current);

export default router;