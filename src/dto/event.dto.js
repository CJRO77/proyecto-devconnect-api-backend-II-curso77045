import { userDTO } from "./user.dto.js";

export const eventDTO = (event) => {

    if (!event) return null;

    const plainEvent = typeof event.toObject === "function"
        ? event.toObject()
        : event;

    return {
        id: plainEvent._id,
        title: plainEvent.title,
        description: plainEvent.description,
        category: plainEvent.category,
        location: plainEvent.location,
        date: plainEvent.date,
        capacity: plainEvent.capacity,
        price: plainEvent.price,
        status: plainEvent.status,
        // Si el organizer viene populado (es un objeto), lo filtramos con userDTO.
        // Si no viene populado (es solo un ObjectId), lo dejamos tal cual.
        organizer: plainEvent.organizer?.firstname
            ? userDTO(plainEvent.organizer)
            : plainEvent.organizer,
        createdAt: plainEvent.createdAt,
        updatedAt: plainEvent.updatedAt,
    };

};

export const eventListDTO = (events) => events.map(eventDTO);