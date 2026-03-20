import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    birthDate: { 
        type: DataTypes.DATEONLY, // Solo fecha, sin hora
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true } 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    isEmailVerified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    isEnabled: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: true // Opcional
    },
    address: { 
        type: DataTypes.TEXT, 
        allowNull: true // Opcional
    },
    lastLogin: { 
        type: DataTypes.DATE, 
        allowNull: true 
    },
    passwordRecoveryToken: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    role: { 
        type: DataTypes.ENUM('user', 'admin'), 
        defaultValue: 'user' 
    }
}, {
    tableName: 'users',
    timestamps: true // Esto crea automáticamente 'createdAt' (fecha de creación) y 'updatedAt'
});

export default User;