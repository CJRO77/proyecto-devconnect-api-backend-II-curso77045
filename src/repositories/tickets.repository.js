import { TicketDAO } from "../dao/ticket.dao.js";

// Crear ticket

export const createTicketRepository = async (ticketData) => {
    return await TicketDAO.create(ticketData);
};

// Obtener ticket por ID

export const getTicketByIdRepository = async (id) => {
    return await TicketDAO.findById(id);
};

// Obtener ticket activo de un usuario para un evento

export const getActiveTicketRepository = async (userId, eventId) => {
    return await TicketDAO.findOne({
        user: userId,
        event: eventId,
        status: { $in: ["pending", "confirmed"] },
    });
};

// Obtener tickets de un usuario

export const getMyTicketsRepository = async (userId) => {
    return await TicketDAO.findByUser(userId);
};

// Obtener tickets de un evento

export const getEventTicketsRepository = async (eventId) => {
    return await TicketDAO.findByEvent(eventId);
};

// Contar lugares reservados (solo tickets activos)

export const countReservedSeatsRepository = async (eventId) => {
    return await TicketDAO.countActiveSeats(eventId);
};

// Cancelar ticket

export const cancelTicketRepository = async (id) => {
    return await TicketDAO.updateById(id, {
        status: "cancelled",
        cancelledAt: new Date(),
    });
};