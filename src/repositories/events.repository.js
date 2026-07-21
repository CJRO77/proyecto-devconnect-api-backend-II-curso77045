import EventModel from "../models/event.model.js";

export const createEventRepository = async (eventData) => {
    return await EventModel.create(eventData);
};

export const getEventsRepository = async () => {
    return await EventModel.find().populate(
        "organizer",
        "firstname lastname email role"
    );
};

export const getEventByIdRepository = async (id) => {
    return await EventModel.findById(id).populate(
        "organizer",
        "firstname lastname email role"
    );
};

export const updateEventRepository = async (id, eventData) => {
    return await EventModel.findByIdAndUpdate(
        id,
        eventData,
        { new: true }
    );
};

export const deleteEventRepository = async (id) => {
    return await EventModel.findByIdAndDelete(id);
};