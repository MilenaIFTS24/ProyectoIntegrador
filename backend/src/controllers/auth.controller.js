import * as AuthService from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Llamamos al servicio que ya creamos (el que usa bcrypt.compare y jwt.sign)
        const result = await AuthService.loginService(email, password);
        
        // Si el login es exitoso, devolvemos el token y datos básicos
        res.status(200).json({
            message: "✅ Login exitoso",
            token: result.token,
            user: result.user
        });
    } catch (error) {
        // Si las credenciales fallan, devolvemos 401 (No autorizado)
        res.status(401).json({ error: error.message });
    }
};