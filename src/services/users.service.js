import { createHash, isValidPassword } from "../utils/bcrypt.js";
import mongoose from "mongoose";
import {
    findUserByEmail,
    createUserRepository,
    findUserById,
    getAllUsersRepository,
    updateUserRepository,
    deleteUserRepository,
} from "../repositories/users.repository.js";
import { ServiceError } from "../utils/ServiceError.js";

export const createUserService = async (userData) => {

    const { firstname, lastname, email, password } = userData;

    if (!firstname || !lastname || !email || !password) {
        throw new ServiceError("Todos los campos son obligatorios", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        throw new ServiceError("El formato del email no es válido", 400);
    }

    if (password.length < 6) {
        throw new ServiceError("La contraseña debe tener al menos 6 caracteres", 400);
    }

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new ServiceError("El email ya está registrado", 409);
    }

    const hashedPassword = createHash(password);

    const user = await createUserRepository({
        firstname,
        lastname,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
    });

    return user;
};

export const loginUserService = async (email, password) => {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw new ServiceError("Credenciales inválidas", 401);
    }

    const validPassword = isValidPassword(password, user.password);

    if (!validPassword) {
        throw new ServiceError("Credenciales inválidas", 401);
    }

    return user;
};

export const currentUserService = async (id) => {

    const user = await findUserById(id);

    if (!user) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    return user;

};

export const getAllUsersService = async () => {
    return await getAllUsersRepository();
};

export const getUserByIdService = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    const user = await findUserById(id);

    if (!user) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    return user;

};

export const updateUserService = async (id, userData) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    const { password, role, ...safeData } = userData;

    const user = await updateUserRepository(id, safeData);

    if (!user) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    return user;

};

export const deleteUserService = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    const user = await deleteUserRepository(id);

    if (!user) {
        throw new ServiceError("Usuario no encontrado", 404);
    }

    return user;

};