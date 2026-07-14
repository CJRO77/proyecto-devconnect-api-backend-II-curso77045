import UserModel from "../models/user.model.js";
import { createUserService } from "../services/users.service.js";

// Obtener todos los usuarios

export const getUsers = async (req, res) => {
  try {

    const users = await UserModel.find();

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

    // Eliminar password de la respuesta
    
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

    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

// buscar usuario por ID y actualizarlo

export const updateUser = async (req, res) => {
  try {

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

// buscar usuario por ID y eliminarlo

export const deleteUser = async (req, res) => {
  try {

    const user = await UserModel.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};