import * as AuthService from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Llamamos al servicio que ya creamos (el que usa bcrypt.compare y jwt.sign)
        const result = await AuthService.loginService(email, password);

        // Actualizamos la última conexión en segundo plano
        await result.user.update({ lastLogin: new Date() });

        // Si el login es exitoso, devolvemos el token y datos básicos
        res.status(200).json({
            message: "✅ Login exitoso",
            token: result.token,
            user: result.user,
            role: result.user.role
        });
    } catch (error) {
        // Si las credenciales fallan, devolvemos 401 (No autorizado)
        res.status(401).json({ error: error.message });
    }
};

export const register = async (req, res) => {
    try {
        // 1. Extraemos los datos del body
        const { fullName, email, password, birthDate, phone, address } = req.body;

        // 2. Llamamos al servicio 
        const result = await AuthService.registerService({
            fullName,
            email,
            password,
            birthDate,
            phone,
            address
        });

        // 3. Respuesta exitosa (201: Creado)
        res.status(201).json({
            message: "✨ Usuario registrado con éxito",
            token: result.token, //para que se loguee de una vez
            user: result.user
        });

    } catch (error) {
        // Si el email ya existe (Error de Sequelize por el campo UNIQUE)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: "El correo electrónico ya está en uso por otro usuario." 
            });
        }

        // Si fallan las validaciones del modelo (ej: email con formato incorrecto)
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        // Error genérico del servidor
        console.error("Error en Register:", error);
        res.status(500).json({ 
            error: "Hubo un problema al procesar tu registro. Inténtalo más tarde." 
        });
    }
};