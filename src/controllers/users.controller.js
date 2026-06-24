import UserModel from "../models/user.model.js";

// Obtener todos los usuarios

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: users,
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

    const existingUser = await UserModel.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    const user = await UserModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};