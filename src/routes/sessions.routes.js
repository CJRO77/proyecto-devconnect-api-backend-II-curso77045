import { Router } from "express";
import passport from "passport";

import {
    login,
    logout,
    current,
    register
} from "../controllers/sessions.controller.js";

import { authenticateLocal } from "../middlewares/localAuth.middleware.js";

// Rutas para sesiones

const router = Router();

router.post("/register", authenticateLocal("register"), register);

router.post("/login", authenticateLocal("login"), login);

router.post("/logout", logout);

router.get(
    "/current",
    passport.authenticate("current", { session: false }),
    current
);

export default router;