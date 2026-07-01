import * as AuthService from '../services/auth.service.js';
import User from '../models/users.model.js';

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.loginService(email, password);

        await User.update(
            { lastLogin: new Date() },
            { where: { id: result.user.id } }
        );

        res.status(200).json({
            message: "Login exitoso",
            token: result.token,
            user: {
                id: result.user.id,
                fullName: result.user.fullName,
                role: result.user.role,
                email: result.user.email
            }
        });

    } catch (error) {
        // 4. Retorna el error
        // Si el error es de credenciales inválidas, devolver un 401
        // Si no, devolver un 500
        const statusCode = error.message.includes('inválid') ? 401 : 500;

        res.status(statusCode).json({
            error: error.message || "Error interno del servidor"
        });
    }
};

// Registro
export const register = async (req, res) => {
    try {
        const { fullName, email, password, birthDate, phone, address } = req.body;

        const result = await AuthService.registerService({
            fullName,
            email,
            password,
            birthDate,
            phone,
            address
        });

        res.status(201).json({
            message: "Usuario registrado con éxito",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        // Errores de Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: "El correo electrónico ya está en uso por otro usuario."
            });
        }

        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        // Otros errores
        console.error("Error en Register Controller:", error);
        res.status(500).json({
            error: "Hubo un problema al procesar tu registro. Inténtalo más tarde."
        });
    }
};