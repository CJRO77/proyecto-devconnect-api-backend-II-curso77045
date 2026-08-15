import {
    createEventService,
    getEventsService,
    getEventByIdService,
    updateEventService,
    changeEventStatusService,
} from "../services/events.service.js";
import { eventDTO, eventListDTO } from "../dto/event.dto.js";
 
// Obtener todos los eventos
 
export const getEvents = async (req, res, next) => {
 
    try {
 
        const result = await getEventsService(req.query);
 
        return res.status(200).json({
            status: "success",
            data: eventListDTO(result.data),
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        });
 
    } catch (error) {
 
        next(error);
 
    }
 
};
 
// Crear un evento
 
export const createEvent = async (req, res, next) => {
 
    try {
 
        const event = await createEventService(req.body, req.user);
 
        return res.status(201).json({
            status: "success",
            message: "Evento creado correctamente",
            payload: eventDTO(event),
        });
 
    } catch (error) {
 
        next(error);
 
    }
 
};
 
// Obtener evento por id
 
export const getEventById = async (req, res, next) => {
 
    try {
 
        const event = await getEventByIdService(req.params.id);
 
        return res.status(200).json({
            status: "success",
            payload: eventDTO(event),
        });
 
    } catch (error) {
 
        next(error);
 
    }
 
};
 
// Actualizar evento
 
export const updateEvent = async (req, res, next) => {
 
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
 
        next(error);
 
    }
 
};
 
// Cambiar estado
 
export const changeEventStatus = async (req, res, next) => {
 
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
 
        next(error);
 
    }
 
};
 