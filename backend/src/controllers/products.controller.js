import * as productService from '../services/products.service.js';

// Obtener todos los productos
export const getAll = async (req, res) => {
    try {
        const productos = await productService.getAllProducts();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un producto por ID
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productService.getProductById(id);
        
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto (Té o Artesanía)
export const create = async (req, res) => {
    try {
        // req.body debe contener los campos: nombre, tipoProducto, precio, etc.
        const nuevoProducto = await productService.createProduct(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear: ' + error.message });
    }
};

// Actualizar producto
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const productoActualizado = await productService.updateProduct(id, req.body);
        
        if (!productoActualizado) {
            return res.status(404).json({ message: 'No se encontró el producto para actualizar' });
        }
        
        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar producto
export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await productService.deleteProduct(id);
        
        if (!eliminado) {
            return res.status(404).json({ message: 'No se encontró el producto para eliminar' });
        }
        
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};