import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // --- Campos Comunes ---
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    marca: { 
        type: DataTypes.STRING, 
        allowNull: true // Puede no aplicar a artesanías manuales
    },
    descripcion: { 
        type: DataTypes.TEXT 
    },
    tipoProducto: { 
        type: DataTypes.ENUM('té', 'artesanía'), 
        allowNull: false 
    },
    tipo: { 
        type: DataTypes.STRING // Ej: 'Verde/Negro' o 'Madera/Cerámica'
    },
    origen: { 
        type: DataTypes.STRING 
    },
    precio: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    imagenUrl: { 
        type: DataTypes.STRING 
    },
    stock: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },

    // --- Campos Específicos para Té ---
    contieneCafeina: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    esOrganico: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    comercioJusto: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    formatoVenta: { 
        type: DataTypes.STRING // Ej: 'Hebras', 'Saquitos'
    },
    pesoUnidad: { 
        type: DataTypes.INTEGER // Ej: gramos
    }

    // Nota: Para artesanías, los campos de té simplemente se guardarán como NULL 
    // o con su valor por defecto, lo cual es correcto en bases de datos SQL.
}, {
    tableName: 'productos',
    timestamps: true
});

export default Producto;