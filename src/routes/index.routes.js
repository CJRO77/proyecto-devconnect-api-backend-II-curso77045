import { Router } from "express";
import usersRouter from "./users.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Bienvenido a DevConnect API",
    version: "1.0.0",
    author: "Jonathan Rodriguez"
  });
});

router.use("/users", usersRouter);

export default router;