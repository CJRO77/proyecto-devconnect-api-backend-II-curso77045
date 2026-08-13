import EventModel from "../models/event.model.js";

// Data Access Object (DAO) para eventos

export const EventDAO = {

    create: async (data) => {
        return await EventModel.create(data);
    },

    find: async (query, { skip, limit, sort } = {}) => {
        return await EventModel.find(query)
            .populate("organizer", "firstname lastname email role")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    },

    count: async (query) => {
        return await EventModel.countDocuments(query);
    },

    findById: async (id) => {
        return await EventModel.findById(id).populate(
            "organizer",
            "firstname lastname email role"
        );
    },

    updateById: async (id, data) => {
        return await EventModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    },

};