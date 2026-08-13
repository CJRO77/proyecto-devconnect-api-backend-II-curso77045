import {
    createEventRepository,
    getEventsRepository,
    getEventByIdRepository,
    updateEventRepository,
    changeEventStatusRepository,
} from "../repositories/events.repository.js";
import { ServiceError } from "../utils/ServiceError.js";
import mongoose from "mongoose";


// Crear un evento

export const createEventService = async (eventData, currentUser) => {

    eventData.organizer = currentUser._id;

    const {
        title,
        description,
        category,
        location,
        date,
        capacity,
        price,
    } = eventData;

    if (
        !title ||
        !description ||
        !category ||
        !location ||
        !date ||
        capacity === undefined ||
        price === undefined
    ) {
        throw new ServiceError("Todos los campos son obligatorios", 400);
    }

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        throw new ServiceError("La fecha del evento no es válida", 400);
    }

    if (eventDate < new Date()) {
        throw new ServiceError("No se pueden crear eventos con fechas pasadas", 400);
    }

    if (capacity <= 0) {
        throw new ServiceError("La capacidad del evento debe ser mayor a 0", 400);
    }

    if (price < 0) {
        throw new ServiceError("El precio del evento no puede ser negativo", 400);
    }

    if (title.length < 5 || title.length > 100) {
        throw new ServiceError(
            "El título del evento debe tener entre 5 y 100 caracteres",
            400
        );
    }

    if (description.length < 10 || description.length > 1000) {
        throw new ServiceError(
            "La descripción del evento debe tener entre 10 y 1000 caracteres",
            400
        );
    }

    if (category.length < 3 || category.length > 50) {
        throw new ServiceError(
            "La categoría del evento debe tener entre 3 y 50 caracteres",
            400
        );
    }

    if (location.length < 5 || location.length > 100) {
        throw new ServiceError(
            "La ubicación del evento debe tener entre 5 y 100 caracteres",
            400
        );
    }

    return await createEventRepository(eventData);
};


// Obtener eventos con filtros y paginación

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

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (location) query.location = location;

    if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const currentPage = parseInt(page, 10);
    const currentLimit = parseInt(limit, 10);

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    return event;

};

// Actualizar un evento

export const updateEventService = async (id, eventData, currentUser) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    if (event.status === "cancelled") {
        throw new ServiceError("No se puede modificar un evento cancelado", 409);
    }

    if (eventData.capacity !== undefined && eventData.capacity <= 0) {
        throw new ServiceError("La capacidad del evento debe ser mayor a 0", 400);
    }

    if (eventData.price !== undefined && eventData.price < 0) {
        throw new ServiceError("El precio del evento no puede ser negativo", 400);
    }

    if (eventData.date) {

        const eventDate = new Date(eventData.date);

        if (isNaN(eventDate.getTime())) {
            throw new ServiceError("La fecha del evento no es válida", 400);
        }

        if (eventDate < new Date()) {
            throw new ServiceError(
                "La fecha del evento no puede ser anterior a la fecha actual",
                400
            );
        }

    }

    if (currentUser.role === "admin") {
        return await updateEventRepository(id, eventData);
    }

    if (!event.organizer.equals(currentUser._id)) {
        throw new ServiceError("No tienes permisos para modificar este evento", 403);
    }

    return await updateEventRepository(id, eventData);

};


// Cambiar el estado de un evento

export const changeEventStatusService = async (id, status, currentUser) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    const event = await getEventByIdRepository(id);

    if (!event) {
        throw new ServiceError("Evento no encontrado", 404);
    }

    const validStatus = ["draft", "published", "cancelled", "finished"];

    if (!validStatus.includes(status)) {
        throw new ServiceError("Estado del evento no válido", 400);
    }

    if (
        status === "published" &&
        (event.status === "cancelled" || event.status === "finished")
    ) {
        throw new ServiceError(
            "No se puede publicar un evento cancelado o finalizado",
            409
        );
    }

    if (event.status === "cancelled") {
        throw new ServiceError("No se puede modificar un evento cancelado", 409);
    }

    if (currentUser.role === "admin") {
        return await changeEventStatusRepository(id, status);
    }

    if (!event.organizer.equals(currentUser._id)) {
        throw new ServiceError("No tienes permisos para modificar este evento", 403);
    }

    return await changeEventStatusRepository(id, status);

};