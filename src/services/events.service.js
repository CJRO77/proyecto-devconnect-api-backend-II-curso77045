import {
    createEventRepository,
    getEventsRepository,
    getEventByIdRepository,
    updateEventRepository,
    deleteEventRepository,
} from "../repositories/events.repository.js";

export const createEventService = async (eventData) => {


     // funcion para validar los campos obligatorios del evento


    const { title, description, category, location, date, capacity } = eventData;    

    if (!title || !description || !category || !location || !date || !capacity) {
        throw new Error("Todos los campos son obligatorios");
    }
    const event = await createEventRepository(eventData);

    return event;

};

     // funcion para obtener todos los eventos

export const getEventsService = async () => {

    return await getEventsRepository();
};


// Función para obtener un evento por su ID

export const getEventByIdService = async (id) => {

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    return event;

};

// Función para actualizar un evento por su ID

export const updateEventService = async (
    id,
    eventData,
    currentUser
) => {

    // Buscar el evento

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    // Si es administrador, puede modificar cualquier evento

    if (currentUser.role === "admin") {

        return await updateEventRepository(
            id,
            eventData
        );

    }

    // Si no es administrador, debe ser el organizador del evento

    if (event.organizer.toString() !== currentUser._id.toString()) {

        throw new Error(
            "No tienes permisos para modificar este evento"
        );

    }

    // Actualizar el evento

    return await updateEventRepository(
        id,
        eventData
    );

};

    // funcion para eliminar un evento por su id

export const deleteEventService = async (id) => {

    const event = await deleteEventRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }
    
    return event;

};