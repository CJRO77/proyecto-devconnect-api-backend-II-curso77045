import {
    createEventService,
    getEventsService,
    getEventByIdService,
    updateEventService,
    changeEventStatusService,
} from "../services/events.service.js";
import { eventDTO, eventListDTO } from "../dto/event.dto.js";

// Obtener todos los eventos

export const getEvents = async (req, res) => {

    try {

        const result = await getEventsService(req.query);

        return res.status(200).json({
            status: "success",
            payload: {
                ...result,
                data: eventListDTO(result.data),
            },
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });

    }

};

// Crear un evento

export const createEvent = async (req, res) => {

    try {

        const event = await createEventService(req.body, req.user);

        return res.status(201).json({
            status: "success",
            message: "Evento creado correctamente",
            payload: eventDTO(event),
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });

    }

};

// Obtener evento por id

export const getEventById = async (req, res) => {

    try {

        const event = await getEventByIdService(req.params.id);

        return res.status(200).json({
            status: "success",
            payload: eventDTO(event),
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });

    }

};

// Actualizar evento

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
            payload: eventDTO(event),
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });

    }

};

// Cambiar estado

export const changeEventStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const event = await changeEventStatusService(
            req.params.id,
            status,
            req.user
        );

        return res.status(200).json({
            status: "success",
            message: "Estado del evento actualizado correctamente",
            payload: eventDTO(event),
        });

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });

    }

};