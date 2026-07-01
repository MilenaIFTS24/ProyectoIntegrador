import Product from '../models/products.model.js';

// Crear un nuevo producto
export const createProductService = async (productData) => { 
    const { productType, origin, materials } = productData;

    if (productType === 'tea' && !origin) {
        throw new Error('Los productos de tipo Té deben tener un origen especificado.');
    }

    if (productType === 'craft' && (!materials || materials.length === 0)) {
        throw new Error('Las artesanías deben incluir al menos un material.');
    }
    
    return await Product.create(productData);
};

// Obtener todos los productos
export const getAllProductsService = async () => {
    return await Product.findAll();
};

// Obtener productos por tipo (te o artesania)
export const getProductsByTypeService = async (type) => {
    if (!['tea', 'craft'].includes(type)) {
        throw new Error("Tipo de producto no válido. Debe ser 'tea' o 'craft'.");
    }
    
    return await Product.findAll({
        where: { productType: type }
    });
};

// Obtener un producto por ID
export const getProductByIdService = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    return product;
};

// Actualizar un producto
export const updateProductService = async (id, updateData) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Producto no encontrado");

    return await product.update(updateData);
};

// Eliminar un producto
export const deleteProductService = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Producto no encontrado");

    await product.destroy();
    return { message: "Producto eliminado correctamente" };
};