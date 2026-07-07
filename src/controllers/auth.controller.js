import UserModel from "../models/user.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Buscar usuario

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Validar password

    const validPassword = isValidPassword(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar JWT
    
    const token = generateToken(user);

    // Guardar el token en una cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login exitoso",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error en login",
      error: error.message,
    });

  }
};

export const logout = (req, res) => {

  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Sesión cerrada correctamente",
  });

};

export const current = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Usuario autenticado",
        data: req.user
    });

};