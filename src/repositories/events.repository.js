import { EventDAO } from "../dao/event.dao.js";

// Crear un evento

export const createEventRepository = async (eventData) => {
    return await EventDAO.create(eventData);
};

// Obtener todos los eventos

export const getEventsRepository = async (
    query,
    page,
    limit,
    sortOptions
) => {

    // Calcular cuántos documentos se deben omitir

    const skip = (page - 1) * limit;

    // Obtener el total de documentos que cumplen los filtros

    const total = await EventDAO.count(query);

    // Obtener los eventos

    const events = await EventDAO.find(query, {

        skip,
        limit,
        sort: sortOptions,
    });

    return {
        data: events,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };

};

// Obtener un evento por ID

export const getEventByIdRepository = async (id) => {
    return await EventDAO.findById(id);
};

// Actualizar un evento

export const updateEventRepository = async (id, eventData) => {
    return await EventDAO.updateById(id, eventData);
};

// Cambiar el estado de un evento

export const changeEventStatusRepository = async (id, status) => {

    return await EventDAO.updateById(id, {status});

};
