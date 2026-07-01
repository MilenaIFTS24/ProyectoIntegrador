import jwt from 'jsonwebtoken';

// Middleware para verificar el token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Acceso denegado. Token no provisto o formato inválido." });
    }

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Acceso denegado. Token no provisto." });

    jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_provisoria', (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido o expirado." });

        req.user = user;
        next();
    });
};

// Middleware para restringir solo a Administradores
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: "Acceso restringido. Se requieren permisos de administrador." });
    }
    next();
};