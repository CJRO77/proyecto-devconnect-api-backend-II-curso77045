import { createHash, isValidPassword } from "../utils/bcrypt.js";
import {
    findUserByEmail,
    createUserRepository,
    findUserById
} from "../repositories/users.repository.js";

  export const createUserService = async (userData) => {

// Validar campos obligatorios

const { firstname, lastname, email, password } = userData;

if (!firstname || !lastname || !email || !password) {
    throw new Error("Todos los campos son obligatorios");
}



// Normalizar email

const normalizedEmail = email.trim().toLowerCase();

// Validar formato del email

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(normalizedEmail)) {
    throw new Error("El formato del email no es válido");
}

// Validar longitud de la contraseña

if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
}

const existingUser = await findUserByEmail(normalizedEmail);

if (existingUser) {
    throw new Error("El email ya está registrado");
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

    // Normalizar email
    
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    // Validar contraseña

    const validPassword = isValidPassword(
        password,
        user.password
    );

    if (!validPassword) {
        throw new Error("Credenciales inválidas");
    }

    return user;
};

export const currentUserService = async (id) => {

    const user = await findUserById(id);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    return user;

};