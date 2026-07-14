import UserModel from "../models/user.model.js";

export const findUserByEmail = async (email) => {
    return await UserModel.findOne({ email });
};

export const createUserRepository = async (userData) => {
    return await UserModel.create(userData);
};

export const findUserById = async (id) => {
    return await UserModel.findById(id);
};