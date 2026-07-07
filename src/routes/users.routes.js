import { Router } from "express";
import { getUsers,createUser,getUserById,updateUser,deleteUser} from "../controllers/users.controller.js";

const router = Router();

// Obtener todos los usuarios

router.get("/", getUsers);
router.get("/:id", getUserById);

// Crear un nuevo usuario

router.post("/", createUser);

// Actualizar un usuario existente

router.put("/:id", updateUser);

// Eliminar un usuario existente

router.delete("/:id", deleteUser);


export default router;