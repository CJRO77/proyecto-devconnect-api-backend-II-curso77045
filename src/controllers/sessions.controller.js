import { generateToken } from "../utils/jwt.js";
import { userDTO } from "../dto/user.dto.js";

export const login = async (req, res) => {

    try {

        const user = req.user;

        const token = generateToken(user);

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            status: "success",
            message: "Login correcto",
            data: userDTO(user),
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
            error: error.message,
        });

    }

};

export const logout = (req, res) => {

    res.clearCookie("currentUser");

    res.status(200).json({
        status: "success",
        message: "Sesión cerrada correctamente",
    });

};

export const current = (req, res) => {

    res.status(200).json({
        status: "success",
        message: "Usuario autenticado",
        data: userDTO(req.user),
    });

};

export const register = (req, res) => {

    try {

        const user = req.user;

        const token = generateToken(user);

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            data: userDTO(user),
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
            error: error.message,
        });

    }

};