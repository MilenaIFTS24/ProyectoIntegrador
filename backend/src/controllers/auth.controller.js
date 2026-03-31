import * as AuthService from '../services/auth.service.js';
import User from '../models/users.model.js'; 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Validamos credenciales en el servicio
        // Este servicio debe devolver { token, user }
        const result = await AuthService.loginService(email, password);

        // 2. ACTUALIZACIÓN SEGURA 
        // Usamos el modelo User directamente para evitar el error ".update is not a function"
        // Esto funciona incluso si 'result.user' es un objeto plano.
        await User.update(
            { lastLogin: new Date() }, 
            { where: { id: result.user.id } }
        );

        // 3. Respuesta exitosa
        res.status(200).json({
            message: "✅ Login exitoso",
            token: result.token,
            user: {
                id: result.user.id,
                fullName: result.user.fullName,
                role: result.user.role,
                email: result.user.email
            }
        });

    } catch (error) {
        // Logueamos el error real en la consola del servidor para debuguear
        console.error("❌ Error en Login Controller:", error.message);

        // Si el error es por credenciales (enviado desde el servicio) mandamos 401
        // Si es un error de código, mandamos 500
        const statusCode = error.message.includes('inválid') ? 401 : 500;
        
        res.status(statusCode).json({ 
            error: error.message || "Error interno del servidor" 
        });
    }
};

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
            message: "✨ Usuario registrado con éxito",
            token: result.token, 
            user: result.user
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: "El correo electrónico ya está en uso por otro usuario."
            });
        }

        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        console.error("❌ Error en Register Controller:", error);
        res.status(500).json({
            error: "Hubo un problema al procesar tu registro. Inténtalo más tarde."
        });
    }
};