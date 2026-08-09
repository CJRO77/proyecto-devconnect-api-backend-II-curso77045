import TicketModel from "../models/ticket.model.js";
import mongoose from "mongoose";

// Crear ticket

export const createTicketRepository = async (ticketData) => {
    return await TicketModel.create(ticketData);
};

// Obtener ticket por ID

export const getTicketByIdRepository = async (id) => {
    return await TicketModel.findById(id)
        .populate("user", "firstname lastname email role")
        .populate("event", "title date location status capacity");
};

// Obtener ticket activo de un usuario para un evento

export const getActiveTicketRepository = async (
    userId,
    eventId
) => {
    return await TicketModel.findOne({
        user: userId,
        event: new mongoose.Types.ObjectId(eventId),
        status: {
            $in: ["pending", "confirmed"],
        },
    });
};

// Obtener tickets de un usuario

export const getMyTicketsRepository = async (userId) => {
    return await TicketModel.find({
        user: userId,
    })
        .populate(
            "event",
            "title date location status"
        )
        .sort({
            createdAt: -1,
        });
};

// Obtener tickets de un evento

export const getEventTicketsRepository = async (eventId) => {
    return await TicketModel.find({
        event: eventId,
    })
        .populate(
            "user",
            "firstname lastname email"
        )
        .sort({
            createdAt: -1,
        });
};

// Contar lugares reservados (solo tickets activos)

export const countReservedSeatsRepository = async (eventId) => {

    const result = await TicketModel.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(eventId), // 👈 fix: casteo explícito
                status: {
                    $in: ["pending", "confirmed"],
                },
            },
        },
        {
            $group: {
                _id: "$event",
                totalReserved: {
                    $sum: "$quantity",
                },
            },
        },
    ]);

    return result[0]?.totalReserved || 0;
};

// Cancelar ticket

export const cancelTicketRepository = async (id) => {

    return await TicketModel.findByIdAndUpdate(
        id,
        {
            status: "cancelled",
            cancelledAt: new Date(),
        },
        {
            new: true,
            runValidators: true,
        }
    );

};