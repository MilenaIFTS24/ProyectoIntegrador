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

