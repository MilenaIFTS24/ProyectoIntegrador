import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

// Modelo para la tabla "products" usando Sequelize
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
    brandArtist: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    creationDate: { type: DataTypes.STRING },
    weight: { type: DataTypes.FLOAT },
    isUnique: { type: DataTypes.BOOLEAN, defaultValue: false },
    materials: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    ecoFriendly: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'products',
    timestamps: true
});

export default Product;