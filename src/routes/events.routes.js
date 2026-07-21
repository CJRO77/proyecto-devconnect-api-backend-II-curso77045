import { Router } from "express";
import passport from "passport";
import {
    getEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/events.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

// Obtener todos los eventos
router.get("/", getEvents);

// Obtener un evento por ID

router.get("/:id", getEventById);

// Crear evento (solo organizer y admin)

router.post(
    "/",
    passport.authenticate("current", { session: false }),
    authorize("organizer", "admin"),
    createEvent
);

// Actualizar evento

router.put(
    "/:id",
    passport.authenticate("current", { session: false }),
    authorize("organizer", "admin"),
    updateEvent
);

// Eliminar evento (solo admin)

router.delete(
    "/:id",
    passport.authenticate("current", { session: false }),
    authorize("admin"),
    deleteEvent
);

export default router;