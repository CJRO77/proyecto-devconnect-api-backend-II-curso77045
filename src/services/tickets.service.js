import mongoose from "mongoose";
import {
    createTicketRepository,
    getTicketByIdRepository,
    getActiveTicketRepository,
    getMyTicketsRepository,
    getEventTicketsRepository,
    countReservedSeatsRepository,
    cancelTicketRepository,
} from "../repositories/tickets.repository.js";

import {
    getEventByIdRepository,
} from "../repositories/events.repository.js";

import { generateReservationCode } from "../utils/generateReservationCode.js";
import { sendTicketConfirmationEmail } from "./mail.service.js";

class ServiceError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Crear ticket (inscripción)

export const createTicketService = async (
    eventId,
    quantity,
    currentUser
) => {

    // 0. Validar formato de eventId

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    // 1. Buscar el evento

    const event = await getEventByIdRepository(eventId);

    if (!event) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    // 2. Verificar que el evento esté publicado

    if (event.status !== "published") {
        throw new ServiceError(
            "El evento no está disponible para inscripciones",
            409
        );
    }

    // 3. Verificar que el evento no haya finalizado

    if (event.date <= new Date()) {
        throw new ServiceError(
            "No es posible inscribirse a un evento finalizado",
            409
        );
    }

    // 4. Validar quantity

    const parsedQuantity = Number(quantity);

    if (
        quantity === undefined ||
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity <= 0
    ) {
        throw new ServiceError(
            "La cantidad debe ser un número entero mayor a 0",
            400
        );
    }

    // 5. Verificar inscripción activa duplicada

    const existingTicket = await getActiveTicketRepository(
        currentUser.id,
        eventId
    );

    if (existingTicket) {
        throw new ServiceError(
            "Ya tienes una inscripción activa para este evento",
            409
        );
    }

    // 6. Contar lugares ocupados

    const reservedSeats = await countReservedSeatsRepository(eventId);

    // 7. Calcular lugares disponibles

    const availableSeats = event.capacity - reservedSeats;

    // 8. Verificar cupos

    if (parsedQuantity > availableSeats) {
        throw new ServiceError(
            `No hay cupos suficientes. Cupos disponibles: ${availableSeats}`,
            409
        );
    }

    // 9. Generar código de reserva

    const reservationCode = generateReservationCode();

    // 10. Crear ticket

    let ticket;

    try {
        ticket = await createTicketRepository({
            user: currentUser.id,
            event: event._id,
            quantity: parsedQuantity,
            reservationCode,
            status: "confirmed",
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new ServiceError(
                "Error al generar el código de reserva, intentá nuevamente",
                409
            );
        }
        throw error;
    }

    const populatedTicket = await getTicketByIdRepository(ticket._id);

    // 11. Enviar email de confirmación (no rompe la creación si falla)

    try {
        await sendTicketConfirmationEmail({
            to: populatedTicket.user.email,
            userName: populatedTicket.user.firstname,
            eventTitle: populatedTicket.event.title,
            eventDate: populatedTicket.event.date,
            eventLocation: populatedTicket.event.location,
            reservationCode: populatedTicket.reservationCode,
            quantity: populatedTicket.quantity,
        });
    } catch (error) {
        console.error("Error al enviar email de confirmación:", error.message);
    }

    return populatedTicket;
};

// Mis tickets

export const getMyTicketsService = async (userId) => {
    return await getMyTicketsRepository(userId);
};

// Tickets de un evento (organizer dueño o admin)

export const getEventTicketsService = async (
    eventId,
    currentUser
) => {

    // 1. Validar formato de eventId

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    // 2. Buscar el evento

    const event = await getEventByIdRepository(eventId);

    if (!event) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    // 3. Verificar permisos: admin o dueño del evento

    const isAdmin = currentUser.role === "admin";
    const isOwner = event.organizer._id.toString() === currentUser.id;

    if (!isAdmin && !isOwner) {
        throw new ServiceError(
            "No tenés permisos para ver las inscripciones de este evento",
            403
        );
    }

    // 4. Obtener tickets del evento

    return await getEventTicketsRepository(eventId);
};

// Cancelar ticket

export const cancelTicketService = async (
    ticketId,
    currentUser
) => {

    // 1. Validar formato de ticketId

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        throw new ServiceError("Ticket no encontrado", 404);
    }

    // 2. Buscar el ticket

    const ticket = await getTicketByIdRepository(ticketId);

    if (!ticket) {
        throw new ServiceError("Ticket no encontrado", 404);
    }

    // 3. Verificar permisos: admin o dueño del ticket

    const isAdmin = currentUser.role === "admin";
    const isOwner = ticket.user._id.toString() === currentUser.id;

    if (!isAdmin && !isOwner) {
        throw new ServiceError(
            "No tenés permisos para cancelar este ticket",
            403
        );
    }

    // 4. Verificar que no esté ya cancelado

    if (ticket.status === "cancelled") {
        throw new ServiceError("El ticket ya está cancelado", 409);
    }

    // 5. Cancelar

    return await cancelTicketRepository(ticketId);
};