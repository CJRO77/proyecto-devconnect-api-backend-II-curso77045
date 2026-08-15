import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
} from "../services/users.service.js";
import { userDTO } from "../dto/user.dto.js";
 
// Obtener todos los usuarios
 
export const getUsers = async (req, res, next) => {
    try {
 
        const users = await getAllUsersService();
 
        res.status(200).json({
            success: true,
            message: "Usuarios obtenidos correctamente",
            data: users.map(userDTO),
        });
 
    } catch (error) {
        next(error);
    }
};
 
export const createUser = async (req, res, next) => {
    try {
 
        const user = await createUserService(req.body);
 
        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente",
            data: userDTO(user),
        });
 
    } catch (error) {
        next(error);
    }
};
 
// Obtener usuario por ID
 
export const getUserById = async (req, res, next) => {
    try {
 
        const user = await getUserByIdService(req.params.id);
 
        res.status(200).json({
            success: true,
            data: userDTO(user),
        });
 
    } catch (error) {
        next(error);
    }
};
 
// Actualizar usuario
 
export const updateUser = async (req, res, next) => {
    try {
 
        const user = await updateUserService(req.params.id, req.body);
 
        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            data: userDTO(user),
        });
 
    } catch (error) {
        next(error);
    }
};
 
// Eliminar usuario
 
export const deleteUser = async (req, res, next) => {
    try {
 
        const user = await deleteUserService(req.params.id);
 
        res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente",
            data: userDTO(user),
        });
 
    } catch (error) {
        next(error);
    }
};
 