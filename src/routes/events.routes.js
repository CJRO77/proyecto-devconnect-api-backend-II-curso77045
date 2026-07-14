import { Router } from "express";
import { getEvents } from "../controllers/events.controller.js";

const router = Router();

// Obtener todos los eventos

router.get("/", getEvents);

export default router;