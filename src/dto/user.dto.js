export const userDTO = (user) => {

    if (!user) return null;

    // Soporta tanto documentos de Mongoose como objetos planos (.lean())

    const plainUser = typeof user.toObject === "function"
        ? user.toObject()
        : user;

    return {
        id: plainUser._id,
        firstname: plainUser.firstname,
        lastname: plainUser.lastname,
        email: plainUser.email,
        role: plainUser.role,
    };

};