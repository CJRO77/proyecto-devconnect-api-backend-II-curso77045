import passport from "passport";

// Middleware de autenticación local

export const authenticateLocal = (strategyName) => {

    return (req, res, next) => {

        passport.authenticate(strategyName, { session: false }, (err, user, info) => {

            if (err) {
                return next(err);
            }

            if (!user) {
                const statusCode = info?.statusCode || 401;
                const message = info?.message || "No autorizado";

                return res.status(statusCode).json({
                    status: "error",
                    message,
                });
            }

            req.user = user;
            next();

        })(req, res, next);

    };

};