import User from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login
export const loginService = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Credenciales inválidas");

    if (!user.isEnabled) throw new Error("La cuenta está deshabilitada");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Credenciales inválidas");

    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET || 'clave_secreta_provisoria', 
        { expiresIn: '1h' } 
    );

    return { token, user: { id: user.id, fullName: user.fullName, role: user.role, email: user.email } };
};

// Registro
export const registerService = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    const token = jwt.sign(
        { id: newUser.id, role: newUser.role }, 
        process.env.JWT_SECRET || 'clave_secreta_provisoria', 
        { expiresIn: '8h' }
    );

    return { 
        token, 
        user: { 
            id: newUser.id, 
            fullName: newUser.fullName, 
            role: newUser.role,
            email: newUser.email 
        } 
    };
};