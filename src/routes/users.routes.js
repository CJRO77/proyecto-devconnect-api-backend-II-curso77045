import { Router } from "express";
import { getUsers,createUser } from "../controllers/users.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", getUsers);

// Crear un nuevo usuario
router.post("/", createUser);


export default router;