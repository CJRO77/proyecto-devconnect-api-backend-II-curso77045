import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
} from "../services/users.service.js";

// Obtener todos los usuarios

export const getUsers = async (req, res) => {
    try {

        const users = await getAllUsersService();

        const usersWithoutPassword = users.map((user) => {
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        });

        res.status(200).json({
            success: true,
            message: "Usuarios obtenidos correctamente",
            data: usersWithoutPassword,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: error.message,
        });
    }
};

export const createUser = async (req, res) => {
    try {

        const user = await createUserService(req.body);

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente",
            data: userWithoutPassword,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Obtener usuario por ID

export const getUserById = async (req, res) => {
    try {

        const user = await getUserByIdService(req.params.id);

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            success: true,
            data: userWithoutPassword,
        });

    } catch (error) {

        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error al obtener usuario",
            error: error.message,
        });
    }
};

// Actualizar usuario

export const updateUser = async (req, res) => {
    try {

        const user = await updateUserService(req.params.id, req.body);

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            data: userWithoutPassword,
        });

    } catch (error) {

        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: error.message,
        });
    }
};

// Eliminar usuario

export const deleteUser = async (req, res) => {
    try {

        const user = await deleteUserService(req.params.id);

        const { password, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente",
            data: userWithoutPassword,
        });

    } catch (error) {

        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error al eliminar usuario",
            error: error.message,
        });
    }
};