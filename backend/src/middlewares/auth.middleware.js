import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: "Acceso denegado. Token no provisto." });

    jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisoria', (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido o expirado." });
        
        req.user = user; // Guardamos los datos del usuario en el request para que el controlador los use
        next(); // ¡Pase libre al siguiente paso!
    });
};

// Middleware para restringir solo a Administradores
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Acceso restringido. Se requieren permisos de administrador." });
    }
    next();
};