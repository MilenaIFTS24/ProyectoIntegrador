import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // --- Atributos Compartidos ---
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING },
    productType: {
        type: DataTypes.ENUM('tea', 'craft'),
        allowNull: false
    },

    // --- Atributos específicos de Tés ---
    brand: { type: DataTypes.STRING }, // brand para tés
    origin: { type: DataTypes.STRING },
    hasCaffeine: { type: DataTypes.BOOLEAN, defaultValue: false },
    isOrganic: { type: DataTypes.BOOLEAN, defaultValue: false },
    isFairTrade: { type: DataTypes.BOOLEAN, defaultValue: false },
    format: { type: DataTypes.STRING },
    weightPerUnit: { type: DataTypes.FLOAT },

    // --- Atributos específicos de Artesanías ---
    brandArtist: { type: DataTypes.STRING }, // brandArtist para artesanías
    category: { type: DataTypes.STRING }, // "accesorios", "vajilla"
    creationDate: { type: DataTypes.STRING }, // Podría ser DATE, pero mantengo STRING
    weight: { type: DataTypes.FLOAT },
    isUnique: { type: DataTypes.BOOLEAN, defaultValue: false },
    materials: {
        type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL soporta arreglos nativos
        defaultValue: []
    },
    ecoFriendly: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'products',
    timestamps: true // Crea createdAt y updatedAt automáticamente
});

export default Product;