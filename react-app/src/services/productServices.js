import api from "./api";

export const getProducts = async () => {
    try {
        const response = await api.get("/product");
        let products = await response.data.products;
        return products;

    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};