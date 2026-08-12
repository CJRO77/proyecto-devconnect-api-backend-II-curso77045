import { Router } from "express";
import passport from "passport";
import {
    createTicketController,
    getMyTicketsController,
    getEventTicketsController,
    cancelTicketController,
} from "../controllers/ticket.controller.js";

const router = Router();

const auth = passport.authenticate("current", { session: false });

router.post("/events/:eid/tickets", auth, createTicketController);
router.get("/tickets/my-tickets", auth, getMyTicketsController);
router.get("/events/:eid/tickets", auth, getEventTicketsController);
router.patch("/tickets/:tid/cancel", auth, cancelTicketController);

export default router;