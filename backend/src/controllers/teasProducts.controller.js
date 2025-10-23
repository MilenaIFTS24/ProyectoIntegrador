import * as teasProductsService from '../services/teasProducts.service.js';

const products = teasProductsService.getAllTeasProducts();
export const getTeasProducts = (req, res) => { //Exportación nombrada (no default)
    try {
        if (products.length === 0 || !products) {
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

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        console.log(product);
        res.status(200).json(product);
    } catch (error) {
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
        const product = teasProductsService.getTeaProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const { name, brand, description, type, origin, hasCaffeine, isOrganic, isFairTrade, price, stock, format, weightPerUnit } = req.body;
        
        // Verificar que al menos un campo esté presente
        if (!name && !brand && !description && !type && !origin && hasCaffeine === undefined && isOrganic === undefined && isFairTrade === undefined && !price && stock === undefined && !format && !weightPerUnit) {
            return res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar' });
        }

        const updatedProduct = teasProductsService.updateTeaProduct(id, { name, brand, description, type, origin, hasCaffeine, isOrganic, isFairTrade, price, stock, format, weightPerUnit }, product);        

        res.status(200).json(updatedProduct);
        console.log(updatedProduct);

    } catch {
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
        const product = products.find((item) => item.id == id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const index = products.findIndex((item) => item.id == id);
        if(index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        products.splice(index, 1);
        res.status(204).json({ message: 'Producto eliminado correctamente' });
        console.log(product);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}