import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;
const pathToFile = path.join(__dirname, '../data/teasProducts.data.json');
const json = fs.readFileSync(pathToFile, 'utf-8');
const products = JSON.parse(json);


export const getAllTeasProducts = () => {
    return products;
};

export const getTeaProductById = (id) => {
    return products.find((item) => item.id == id);
};

export const createTeaProduct = (data) => {
    const newProduct = { 
        id: products.length + 1, 
        ...data 
    };
    products.push(newProduct);

    fs.writeFileSync(pathToFile, JSON.stringify(products, null, 2), "utf-8");

    return newProduct;
};

export const updateTeaProduct = (id, updateData) => {

    const productIndex = products.findIndex((item) => item.id == id);
    if (productIndex === -1) {
        return null;
    }
    const updatedProduct = {
        id: id,
        ...products[productIndex],
        ...updateData
    };
    products[productIndex] = updatedProduct;

    fs.writeFileSync(pathToFile, JSON.stringify(products, null, 2), "utf-8");

    return updatedProduct;
}

export const deleteTeaProduct = (id) => {
    const productIndex = products.findIndex((item) => item.id == id);
    if (productIndex === -1) {
        return null;
    }
    const deletedProduct = products.splice(productIndex, 1)[0];

    fs.writeFileSync(pathToFile, JSON.stringify(products, null, 2), "utf-8");

    return deletedProduct;
}
