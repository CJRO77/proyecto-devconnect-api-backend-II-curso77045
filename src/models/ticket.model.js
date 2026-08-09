import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "cancelled",
            ],
            default: "confirmed",
        },

        reservationCode: {
            type: String,
            required: true,
            unique: true,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const TicketModel = mongoose.model(
    "Ticket",
    ticketSchema
);

export default TicketModel;