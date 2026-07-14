import { Router } from "express";
import usersRouter from "./users.routes.js";
import eventsRouter from "./events.routes.js";

const router = Router();

// Ruta de bienvenida

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Bienvenido a DevConnect API",
    version: "1.0.0",
    author: "Jonathan Rodriguez"
  });
});

// Ruta de salud del servidor

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Servidor activo",
    timestamp: new Date().toISOString(),
  });
});

router.use("/users", usersRouter);
router.use("/events", eventsRouter);

export default router;