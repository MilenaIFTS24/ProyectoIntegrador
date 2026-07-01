import * as UserService from '../services/users.service.js';

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const newUser = await UserService.createUserService(req.body);
        res.status(201).json({
            message: "Usuario creado con éxito",
            data: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error al listar usuarios" });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserByIdService(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await UserService.updateUserService(id, req.body);
        res.status(200).json({ message: "Usuario actualizado", data: updatedUser });
    } catch (error) {
        res.status(error.message.includes("encontrado") ? 404 : 400).json({ error: error.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserService.deleteUserService(id);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
