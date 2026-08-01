import EventModel from "../models/event.model.js";

// Crear un evento

export const createEventRepository = async (eventData) => {
    return await EventModel.create(eventData);
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

    const total = await EventModel.countDocuments(query);

    // Obtener los eventos

    const events = await EventModel.find(query)
        .populate(
            "organizer",
            "firstname lastname email role"
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();

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
    return await EventModel.findById(id).populate(
        "organizer",
        "firstname lastname email role"
    );
};

// Actualizar un evento

export const updateEventRepository = async (id, eventData) => {
    return await EventModel.findByIdAndUpdate(
        id,
        eventData,
        {
            new: true,
            runValidators: true,
        }
    );
};


// Cambiar el estado de un evento

export const changeEventStatusRepository = async (
    id,
    status
) => {

 return await EventModel.findByIdAndUpdate(
    id,
    { status },
    {
        new: true,
        runValidators: true,
    }
);

};