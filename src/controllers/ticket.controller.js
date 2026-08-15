import {
    createTicketService,
    getMyTicketsService,
    getEventTicketsService,
    cancelTicketService,
} from "../services/tickets.service.js";
import { ticketDTO, ticketListDTO } from "../dto/ticket.dto.js";
 
export const createTicketController = async (req, res, next) => {
    try {
        const { eid } = req.params;
        const { quantity } = req.body;
 
        const ticket = await createTicketService(eid, quantity, req.user);
 
        return res.status(201).json({
            success: true,
            message: "Inscripción confirmada",
            data: ticketDTO(ticket),
        });
    } catch (error) {
        next(error);
    }
};
 
export const getMyTicketsController = async (req, res, next) => {
    try {
        const tickets = await getMyTicketsService(req.user);
 
        return res.status(200).json({
            success: true,
            data: ticketListDTO(tickets),
        });
    } catch (error) {
        next(error);
    }
};
 
export const getEventTicketsController = async (req, res, next) => {
    try {
        const { eid } = req.params;
        const tickets = await getEventTicketsService(eid, req.user);
 
        return res.status(200).json({
            success: true,
            data: ticketListDTO(tickets),
        });
    } catch (error) {
        next(error);
    }
};
 
export const cancelTicketController = async (req, res, next) => {
    try {
        const { tid } = req.params;
        const ticket = await cancelTicketService(tid, req.user);
 
        return res.status(200).json({
            success: true,
            message: "Inscripción cancelada",
            data: ticketDTO(ticket),
        });
    } catch (error) {
        next(error);
    }
};