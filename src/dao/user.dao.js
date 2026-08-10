import UserModel from "../models/user.model.js";

export const UserDAO = {

    findOne: async (filter) => {
        return await UserModel.findOne(filter);
    },

    findById: async (id) => {
        return await UserModel.findById(id);
    },

    findAll: async () => {
        return await UserModel.find();
    },

    create: async (data) => {
        return await UserModel.create(data);
    },

    updateById: async (id, data) => {
        return await UserModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    },

    deleteById: async (id) => {
        return await UserModel.findByIdAndDelete(id);
    },

};