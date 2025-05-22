import api from "./api.js";

export const getUser = async () => {
    try{
        const response = await api.get("/user");
        let users = await response.data.user;
        if(response.status === 200){
            return users;
        }else {
            alert("Can't found User");
        }
    }catch (error){
        console.error("Error fetching data.",error);
        throw error;
    }
};

export const getUserID = async (id) => {
    try {
        let response = await api.get(`/user/${id}`);
        if (response.status === 200){
            return response.data.user;
        }
        else alert("Can't fetch data");
    } catch (error){
        console.error("Error fetching data.",error);
        throw error;
    }
}

export const updateUser = async (id, data) => {
    try{
        let response = await api.get(`/user/${id}`, data);
        if (response.status === 200){
            return true;
        }else return false;
    } catch (error){
        console.error("Error fetching data.",error);
        throw error;
    }
}