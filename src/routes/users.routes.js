import { Router } from "express";
import passport from "passport";

import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/users.controller.js";

import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

// Obtener todos los usuarios (Solo Admin)

router.get(
    "/",
    passport.authenticate("current", { session: false }),
    authorize(["admin"]),
    getUsers
);

// Obtener usuario por ID

router.get("/:id", getUserById);

// Crear usuario

router.post("/", createUser);

// Actualizar usuario

router.put("/:id", updateUser);

// Eliminar usuario

router.delete("/:id", deleteUser);


export default router;