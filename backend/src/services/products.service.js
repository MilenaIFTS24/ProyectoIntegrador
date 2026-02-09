import Product from '../models/products.model.js';

// Estas funciones reemplazan tus llamadas a Firestore o fs.readFileSync
export const getAllProducts = async () => {
    return await Product.findAll(); // Sequelize hace el "SELECT * FROM productos"
};

export const getProductById = async (id) => {
    return await Product.findByPk(id);
};

export const createProduct = async (data) => {
    // Esto reemplaza al addDoc de Firestore o al push del JSON
    return await Product.create(data);
};

export const updateProduct = async (id, updateData) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(updateData);
};

export const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
};