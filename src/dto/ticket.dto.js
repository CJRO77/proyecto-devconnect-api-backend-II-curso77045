import { userDTO } from "./user.dto.js";
import { eventDTO } from "./event.dto.js";

export const ticketDTO = (ticket) => {

    if (!ticket) return null;

    const plainTicket = typeof ticket.toObject === "function"
        ? ticket.toObject()
        : ticket;

    return {
        id: plainTicket._id,
        user: plainTicket.user?.firstname
            ? userDTO(plainTicket.user)
            : plainTicket.user,
        event: plainTicket.event?.title
            ? eventDTO(plainTicket.event)
            : plainTicket.event,
        quantity: plainTicket.quantity,
        status: plainTicket.status,
        reservationCode: plainTicket.reservationCode,
        cancelledAt: plainTicket.cancelledAt,
        createdAt: plainTicket.createdAt,
    };

};

export const ticketListDTO = (tickets) => tickets.map(ticketDTO);