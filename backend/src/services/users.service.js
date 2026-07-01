import User from '../models/users.model.js';
import bcrypt from 'bcrypt';

// Crear un nuevo usuario
export const createUserService = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) throw new Error("El email ya está registrado.");

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const newUser = await User.create(userData);
    const userJson = newUser.toJSON();
    delete userJson.password;
    return userJson;
};

// Listar todos los usuarios
export const getAllUsersService = async () => {
    return await User.findAll({
        attributes: { exclude: ['password', 'passwordRecoveryToken'] }
    });
};

// Actualizar un usuario
export const updateUserService = async (id, updateData) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado.");

    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.update(updateData);

    const updatedUser = user.toJSON();
    delete updatedUser.password;
    delete updatedUser.passwordRecoveryToken;
    
    return updatedUser;
};

// Eliminar un usuario
export const deleteUserService = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("Usuario no encontrado.");
    await user.destroy();
    return { message: "Usuario eliminado correctamente" };
};