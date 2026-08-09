import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    createTicketController,
    getMyTicketsController,
    getEventTicketsController,
    cancelTicketController,
} from "../controllers/ticket.controller.js";

const router = Router();

router.post("/events/:eid/tickets", authMiddleware, createTicketController);
router.get("/tickets/my-tickets", authMiddleware, getMyTicketsController);
router.get("/events/:eid/tickets", authMiddleware, getEventTicketsController);
router.patch("/tickets/:tid/cancel", authMiddleware, cancelTicketController);

export default router;
