import { teasProducts } from "../data/teasProducts.data";

const products = teasProducts;

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
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }
    const product = products.find((item) => item.id == id);

     // Si el producto no existe, product sera undefined
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log(product);
    res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

export const createTeaProduct = (req, res) => {
    try{

        console.log(req.body);
    const { name, brand, description, type, origin, hasCaffeine, isOrganic, isFairTrade, price, stock, format, weightPerUnit } = req.body;

    if (!name || !brand || !type || !origin || !price || !stock || !format) {
        res.status(400).json({ error: 'Campos requeridos: Nombre, Marca, Tipo, Origen, Precio, Stock y Formato.' });
    }

    const newProduct = {
        id: products.length + 1,
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
    };
    products.push(newProduct);
    res.status(201).json(newProduct); 
    console.log(newProduct);

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};