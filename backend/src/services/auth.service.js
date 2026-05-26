import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginService = async (email, password) => {
    // 1. Buscar al usuario
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Credenciales inválidas");

    // 2. Verificar si está habilitado
    if (!user.isEnabled) throw new Error("La cuenta está deshabilitada");

    // 3. Comparar contraseñas usando el Salt que explicamos antes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Credenciales inválidas");

    // 4. Generar el JWT
    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'clave_secreta_provisoria', 
        { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, fullName: user.fullName, role: user.role } };
};

export const registerService = async (userData) => {
    // 1. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 2. Crear el usuario en la DB con Sequelize
    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    // 3. Generar el JWT para login automático
    const token = jwt.sign(
        { id: newUser.id, role: newUser.role }, 
        process.env.JWT_SECRET || 'clave_secreta_provisoria', 
        { expiresIn: '8h' }
    );

    // 4. Retornamos datos limpios (sin el hash de la contraseña)
    return { 
        token, 
        user: { 
            id: newUser.id, 
            fullName: newUser.fullName, 
            role: newUser.role 
        } 
    };
};