import Product from '../models/products.model.js';

export const createProductService = async (productData) => {
    // 1. Validaciones de Lógica de Negocio
    const { productType, origin, materials } = productData;

    if (productType === 'tea' && !origin) {
        throw new Error('Los productos de tipo Té deben tener un origen especificado.');
    }

    if (productType === 'craft' && (!materials || materials.length === 0)) {
        throw new Error('Las artesanías deben incluir al menos un material.');
    }

    // 2. Persistencia
    return await Product.create(productData);
};

export const getAllProductsService = async () => {
    return await Product.findAll();
};

export const getProductsByTypeService = async (type) => {
    // Validamos que el tipo sea uno de los permitidos
    if (!['tea', 'craft'].includes(type)) {
        throw new Error("Tipo de producto no válido. Debe ser 'tea' o 'craft'.");
    }
    
    return await Product.findAll({
        where: { productType: type }
    });
};

export const getProductByIdService = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    return product;
};

export const updateProductService = async (id, updateData) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Producto no encontrado");

    // Actualiza el producto con los datos nuevos
    return await product.update(updateData);
};

export const deleteProductService = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Producto no encontrado");

    await product.destroy();
    return { message: "Producto eliminado correctamente" };
};