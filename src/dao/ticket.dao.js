import TicketModel from "../models/ticket.model.js";
import mongoose from "mongoose";

// Data Access Object (DAO) para tickets

export const TicketDAO = {

    create: async (data) => {
        return await TicketModel.create(data);
    },

    findById: async (id) => {
        return await TicketModel.findById(id)
            .populate("user", "firstname lastname email role")
            .populate("event", "title date location status capacity");
    },

    findOne: async (filter) => {
        return await TicketModel.findOne(filter);
    },

    findByUser: async (userId) => {
        return await TicketModel.find({ user: userId })
            .populate("event", "title date location status")
            .sort({ createdAt: -1 });
    },

    findByEvent: async (eventId) => {
        return await TicketModel.find({ event: eventId })
            .populate("user", "firstname lastname email")
            .sort({ createdAt: -1 });
    },

    countActiveSeats: async (eventId) => {
        const result = await TicketModel.aggregate([
            {
                $match: {
                    event: new mongoose.Types.ObjectId(eventId),
                    status: { $in: ["pending", "confirmed"] },
                },
            },
            {
                $group: {
                    _id: "$event",
                    totalReserved: { $sum: "$quantity" },
                },
            },
        ]);
        return result[0]?.totalReserved || 0;
    },

    updateById: async (id, data) => {
        return await TicketModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    },

};