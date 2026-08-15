export const errorHandler = (error, req, res, next) => {

    const statusCode = error.statusCode || 500;

    // Log solo para errores realmente inesperados (500), no para errores de negocio

    if (statusCode === 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        status: "error",
        message: error.message || "Error interno del servidor",
    });

};