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

// Rutas para usuarios

const router = Router();

const auth = passport.authenticate("current", { session: false });

// obtener todos los usuarios (Solo Admin)


router.get("/", auth, authorize("admin"), getUsers);


// Obtener usuario por ID (cualquier usuario autenticado)

router.get("/:id", auth, getUserById);


// Crear usuario (Solo Admin)

router.post("/", auth, authorize("admin"), createUser);


// Actualizar usuario (Solo Admin)

router.put("/:id", auth, authorize("admin"), updateUser);


// Eliminar usuario (Solo Admin)


router.delete("/:id", auth, authorize("admin"), deleteUser);


export default router;