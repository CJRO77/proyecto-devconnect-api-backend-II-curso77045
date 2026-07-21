export const authorize = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para acceder a esta acción"
            });

        }

        next();

    };

};

