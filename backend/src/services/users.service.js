import User from '../models/users.model.js';
import bcrypt from 'bcrypt';

export const createUserService = async (userData) => {
    // 1. Verificar email único
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) throw new Error("El email ya está registrado.");

    // 2. ENCRIPTAR CONTRASEÑA (Rigor Técnico)
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    return await User.create(userData);
};

export const getAllUsersService = async () => {
    return await User.findAll({
        attributes: { exclude: ['password', 'passwordRecoveryToken'] }
    });
};

export const getUserByIdService = async (id) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password', 'passwordRecoveryToken'] }
    });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
};

export const updateUserService = async (id, updateData) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado.");

    // Si el usuario está intentando cambiar su contraseña, debemos encriptar la nueva
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    return await user.update(updateData);
};

export const deleteUserService = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado.");
    
    await user.destroy();
    return { message: "Usuario eliminado correctamente" };
};