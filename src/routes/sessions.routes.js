import { Router } from "express";
import passport from "passport";

import {
    login,
    logout,
    current,
    register
} from "../controllers/sessions.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router();


router.post(
    "/register",
    passport.authenticate("register", {
        session: false
    }),
    register
);


router.post(
    "/login",
    passport.authenticate("login", {
        session: false
    }),
    login
);


router.post("/logout", logout);


router.get(
    "/current",
    passport.authenticate("current", { session: false }),
    current
);


export default router;
