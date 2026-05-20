import * as ProductService from '../services/products.service.js';

export const createProduct = async (req, res) => {
    try {
        // Llamamos al servicio pasando solo los datos necesarios
        const newProduct = await ProductService.createProductService(req.body);
        
        res.status(201).json({
            message: "✅ Producto creado exitosamente",
            data: newProduct
        });
    } catch (error) {
        // Capturamos los errores lanzados por el servicio
        res.status(400).json({ error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProductsService();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

export const getProductsByType = async (req, res) => {
    try {
        const { type } = req.params; // Extrae 'tea' o 'craft' de la URL
        const products = await ProductService.getProductsByTypeService(type);
        
        res.status(200).json(products);
    } catch (error) {
        // Si el tipo no es válido, el servicio lanzará un error y caerá aquí
        res.status(400).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductService.getProductByIdService(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await ProductService.updateProductService(id, req.body);
        res.status(200).json({ message: "✅ Producto actualizado", data: updatedProduct });
    } catch (error) {
        res.status(error.message === "Producto no encontrado" ? 404 : 400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductService.deleteProductService(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};