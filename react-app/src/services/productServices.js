import api from "./api";

export const getProducts = async () => {
    try {
        const response = await api.get("/product");
        let products = await response.data.products;
        if(response.status==200){
            return products;
        }else{
            alert("Can not fetch product");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        let response = await api.get(`/product/${id}`);
        if(response.status == 200){
            return response.data.product;
        }else{
            alert("Can not fetch product");
        }
    } catch (error) {
        console.error("Error fetching products:",error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        let response = await api.delete(`/product/${id}`);
        if(response.status == 200){
            getProducts();
        }
    } catch (error) {
        console.error("Error fetching products:",error);
        throw error;
    }
};

export const createProduct = async (data) => {
    try {
        let response = await api.post('/product',data);
        if(response.status == 201){
            return true;
        }
    } catch (error) {
       console.error("Error fetching products:",error);
        throw error;
    }
};

export const updateProduct = async (id, data) => {
    try {
        let response = await api.post(`/product/${id}`, data);
        if (response.status == 200) {
            return true;
        } else {
            alert("Failed to update product");
            return false;
        }
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};