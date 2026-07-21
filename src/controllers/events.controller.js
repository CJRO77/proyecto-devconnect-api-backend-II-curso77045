import {
    createEventService,
    getEventsService,
    getEventByIdService,
    updateEventService,
    deleteEventService,
} from "../services/events.service.js";


// Obtener todos los eventos

export const getEvents = async (req, res) => {

    try {

        const events = await getEventsService();

        return res.status(200).json({
            status: "success",
            message: "Lista de eventos",
            payload: events,
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message,
        });

    }

};


// Crear un nuevo evento

export const createEvent = async (req, res) => {

    try {

        const eventData = {
            ...req.body,
            organizer: req.user._id,
        };

        const event = await createEventService(eventData);

        return res.status(201).json({
            status: "success",
            message: "Evento creado correctamente",
            payload: event,
        });

    } catch (error) {

        return res.status(400).json({
            status: "error",
            message: error.message,
        });

    }

};


// Obtener un evento por ID

export const getEventById = async (req, res) => {

    try {

        const event = await getEventByIdService(req.params.id);

        return res.status(200).json({
            status: "success",
            payload: event,
        });

    } catch (error) {

        return res.status(404).json({
            status: "error",
            message: error.message,
        });

    }

};


// Actualizar un evento

export const updateEvent = async (req, res) => {

    try {

        const event = await updateEventService(
            req.params.id,
            req.body,
            req.user
        );

        return res.status(200).json({
            status: "success",
            message: "Evento actualizado correctamente",
            payload: event,
        });

    } catch (error) {

        return res.status(400).json({
            status: "error",
            message: error.message,
        });

    }

};


// Eliminar un evento

export const deleteEvent = async (req, res) => {

    try {

        await deleteEventService(req.params.id);

        return res.status(200).json({
            status: "success",
            message: "Evento eliminado correctamente",
        });

    } catch (error) {

        return res.status(400).json({
            status: "error",
            message: error.message,
        });

    }

};