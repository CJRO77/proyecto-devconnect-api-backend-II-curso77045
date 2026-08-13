import bcrypt from "bcryptjs";

// Función para crear un hash de contraseña

export const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const isValidPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};