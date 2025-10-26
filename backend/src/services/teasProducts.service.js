import * as model from "../models/teasProducts.model.js";

export const getAllTeasProducts = () => {
    return model.getAllTeasProducts();
};

export const getTeaProductById = (id) => {
    const product = model.getTeaProductById(id);
    if (!product) {
        throw new Error('Producto no encontrado');
    }
    return product;
}

export const createTeaProduct = (data) => {
    return model.createTeaProduct(data); 
    
};

export const updateTeaProduct = (id, updateData) => {
    
    const updateProduct = model.getTeaProductById(id);
    if (!updateProduct) {
        throw new Error('Producto no encontrado');
    }   

    return model.updateTeaProduct(id, updateData);
}

export const deleteTeaProduct = (id) => {
    const updateProduct = model.getTeaProductById(id);
    if (!updateProduct) {
        throw new Error('Producto no encontrado');
    }   
    return model.deleteTeaProduct(id);

    
}