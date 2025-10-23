import { teasProducts } from "../data/teasProducts.data.js";

const products = teasProducts;

export const getAllTeasProducts = () => {
    return products;
};

export const getTeaProductById = (id) => {
    return products.find((item) => item.id == id);
}

export const createTeaProduct = (data) => { 
    const newProduct = {id: products.length + 1, ...data };
    products.push(newProduct);
    return newProduct;
};

export const updateTeaProduct = (id, updateData, product) => {
    const productIndex = products.findIndex((item) => item.id == id);
    if (productIndex === -1) {
        return null;
    }

    const updatedProduct = {
        ...product,
        name: updateData.name || product.name,
        brand: updateData.brand || product.brand,
        description: updateData.description || product.description,
        type: updateData.type || product.type,
        origin: updateData.origin || product.origin,
        hasCaffeine: updateData.hasCaffeine !== undefined ? updateData.hasCaffeine : product.hasCaffeine,
        isOrganic: updateData.isOrganic !== undefined ? updateData.isOrganic : product.isOrganic,
        isFairTrade: updateData.isFairTrade !== undefined ? updateData.isFairTrade : product.isFairTrade,
        price: updateData.price || product.price,
        stock: updateData.stock !== undefined ? updateData.stock : product.stock,
        format: updateData.format || product.format,
        weightPerUnit: updateData.weightPerUnit || product.weightPerUnit
    }
    products[productIndex] = updatedProduct;
    return updatedProduct;
}