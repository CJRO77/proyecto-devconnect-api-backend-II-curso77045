import {
    createEventRepository,
    getEventsRepository,
    getEventByIdRepository,
    updateEventRepository,
    changeEventStatusRepository,
} from "../repositories/events.repository.js";


// Crear un evento

export const createEventService = async (eventData, currentUser) => {

    // Asignar automáticamente el organizador

    eventData.organizer = currentUser._id;

    // Obtener los datos del evento

    const {
        title,
        description,
        category,
        location,
        date,
        capacity,
        price,
    } = eventData;

    // Validar campos obligatorios

    if (
        !title ||
        !description ||
        !category ||
        !location ||
        !date ||
        capacity === undefined ||
        price === undefined
    ) {
        throw new Error("Todos los campos son obligatorios");
    }

    // Validar formato de fecha

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        throw new Error("La fecha del evento no es válida");
    }

    // No permitir fechas pasadas

    if (eventDate < new Date()) {
        throw new Error("No se pueden crear eventos con fechas pasadas");
    }

    // Validar capacidad

    if (capacity <= 0) {
        throw new Error("La capacidad del evento debe ser mayor a 0");
    }

    // Validar precio

    if (price < 0) {
        throw new Error("El precio del evento no puede ser negativo");
    }

    // Validar longitud del título

    if (title.length < 5 || title.length > 100) {
        throw new Error(
            "El título del evento debe tener entre 5 y 100 caracteres"
        );
    }

    // Validar longitud de la descripción

    if (description.length < 10 || description.length > 1000) {
        throw new Error(
            "La descripción del evento debe tener entre 10 y 1000 caracteres"
        );
    }

    // Validar longitud de la categoría

    if (category.length < 3 || category.length > 50) {
        throw new Error(
            "La categoría del evento debe tener entre 3 y 50 caracteres"
        );
    }

    // Validar longitud de la ubicación

    if (location.length < 5 || location.length > 100) {
        throw new Error(
            "La ubicación del evento debe tener entre 5 y 100 caracteres"
        );
    }

    return await createEventRepository(eventData);
};

// Obtener todos los eventos

export const getEventsService = async (filters) => {

    const {
        status,
        category,
        location,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10,
        sort,
    } = filters;

    // Objeto con los filtros para MongoDB

    const query = {};

    // Filtrar por estado

    if (status) {
        query.status = status;
    }

    // Filtrar por categoría

    if (category) {
        query.category = category;
    }

    // Filtrar por ubicación

    if (location) {
        query.location = location;
    }

    // Filtrar por rango de fechas

    if (dateFrom || dateTo) {

        query.date = {};

        if (dateFrom) {
            query.date.$gte = new Date(dateFrom);
        }

        if (dateTo) {
            query.date.$lte = new Date(dateTo);
        }

    }

    // Configurar paginación

    const currentPage = parseInt(page, 10);

    const currentLimit = parseInt(limit, 10);

    // Configurar ordenamiento

   const sortOptions = {};

   if (sort === "date") {
    sortOptions.date = 1;
    } else if (sort === "-date") {
    sortOptions.date = -1;
   }  

    return await getEventsRepository(
        query,
        currentPage,
        currentLimit,
        sortOptions
    );

};

// Obtener un evento por ID

export const getEventByIdService = async (id) => {

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    return event;

};

// Actualizar un evento

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

    // No permitir modificar eventos cancelados

    if (event.status === "cancelled") {
        throw new Error("No se puede modificar un evento cancelado");
    }

    // Validar capacidad

    if (
        eventData.capacity !== undefined &&
        eventData.capacity <= 0
    ) {
        throw new Error(
            "La capacidad del evento debe ser mayor a 0"
        );
    }

    // validar precio

    if (
        eventData.price !== undefined &&
        eventData.price < 0
    ) {
        throw new Error(
            "El precio del evento no puede ser negativo"
        );
    }

    // Validar fecha si se proporciona una nueva fecha

    if (eventData.date) {

        const eventDate = new Date(eventData.date);

        if (isNaN(eventDate.getTime())) {
            throw new Error("La fecha del evento no es válida");
        }

        if (eventDate < new Date()) {
            throw new Error(
                "La fecha del evento no puede ser anterior a la fecha actual"
            );
        }

    }

    // El administrador puede modificar cualquier evento

    if (currentUser.role === "admin") {

        return await updateEventRepository(
            id,
            eventData
        );

    }

    // El organizador solo puede modificar sus propios eventos

  if (!event.organizer.equals(currentUser._id)) {
    throw new Error(
        "No tienes permisos para modificar este evento"
    );
}

    return await updateEventRepository(
        id,
        eventData
    );

};


// Cambiar el estado de un evento

export const changeEventStatusService = async (
    id,
    status,
    currentUser
) => {

    // Buscar el evento

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    // Validar estados permitidos

    const validStatus = [
        "draft",
        "published",
        "cancelled",
        "finished",
    ];

    if (!validStatus.includes(status)) {
        throw new Error("Estado del evento no válido");
    }

    // No permitir publicar eventos cancelados o finalizados

if (
    status === "published" &&
    (event.status === "cancelled" || event.status === "finished")
) {
    throw new Error(
        "No se puede publicar un evento cancelado o finalizado"
    );
}

    // No permitir modificar eventos cancelados

    if (event.status === "cancelled") {
        throw new Error("No se puede modificar un evento cancelado");
    }

    // El administrador puede modificar cualquier evento

    if (currentUser.role === "admin") {

        return await changeEventStatusRepository(
            id,
            status
        );

    }

    // El organizador solo puede modificar sus propios eventos

 if (!event.organizer.equals(currentUser._id)) {
    throw new Error(
        "No tienes permisos para modificar este evento"
    );
}

    // Actualizar el estado

    return await changeEventStatusRepository(
        id,
        status
    );

};