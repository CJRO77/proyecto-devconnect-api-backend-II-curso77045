import { UserDAO } from "../dao/user.dao.js";

export const findUserByEmail = async (email) => {
    return await UserDAO.findOne({ email });
};

export const createUserRepository = async (userData) => {
    return await UserDAO.create(userData);
};

export const findUserById = async (id) => {
    return await UserDAO.findById(id);
};

export const getAllUsersRepository = async () => {
    return await UserDAO.findAll();
};

export const updateUserRepository = async (id, userData) => {
    return await UserDAO.updateById(id, userData);
};

export const deleteUserRepository = async (id) => {
    return await UserDAO.deleteById(id);
};