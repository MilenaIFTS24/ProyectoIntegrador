import * as teasProductsService from '../services/teasProducts.service.js';

export const getTeasProducts = (req, res) => { //Exportación nombrada (no default)
    try {
        const products = teasProductsService.getAllTeasProducts();
        
        if (products.length === 0) {
            return res.status(404).json({ error: 'No hay productos disponibles' });
        }
        res.status(200).json(products);
        console.log(products);

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getTeaProductById = (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const product = teasProductsService.getTeaProductById(id);

        console.log(product);
        res.status(200).json(product);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

export const createTeaProduct = (req, res) => {
    try {

        console.log(req.body);
        const { name, brand, description, type, origin, hasCaffeine, isOrganic, isFairTrade, price, stock, format, weightPerUnit } = req.body;

        if (!name || !brand || !type || !origin || !price || !stock || !format) {
            return res.status(400).json({ error: 'Campos requeridos: Nombre, Marca, Tipo, Origen, Precio, Stock y Formato.' });
        }

        const newProduct = teasProductsService.createTeaProduct({
            name,
            brand,
            description,
            type,
            productType: 'tea',
            origin,
            hasCaffeine,
            isOrganic,
            isFairTrade,
            price,
            format,
            weightPerUnit,
            stock,
            image: '/assets/default-tea.jpg'
        });
        
        res.status(201).json(newProduct);
        console.log(newProduct);

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateTeaProduct = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }     
        
        const { name, brand, description, type, origin, hasCaffeine, isOrganic, isFairTrade, price, stock, format, weightPerUnit } = req.body;
        
        if (!name && !brand && !description && !type && !origin && hasCaffeine === undefined && isOrganic === undefined && isFairTrade === undefined && !price && stock === undefined && !format && !weightPerUnit) {
            return res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar' });
        }

        const updatedProduct = teasProductsService.updateTeaProduct(id, { name, brand, description, type, origin, hasCaffeine, isOrganic, isFairTrade, price, stock, format, weightPerUnit });        

        res.status(200).json(updatedProduct);
        console.log(updatedProduct);

    } catch(error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
        
    }
}

export const deleteTeaProduct = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }
        const deletedProduct = teasProductsService.deleteTeaProduct(id);
        
        res.status(200).json({ message: 'Producto eliminado correctamente' });
        console.log(deletedProduct);
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}