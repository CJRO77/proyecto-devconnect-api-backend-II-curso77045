import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {

    try {

        const token = req.cookies.currentUser;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No autenticado"
            });
        }

        const payload = verifyToken(token);

        req.user = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token inválido"
        });

    }

};