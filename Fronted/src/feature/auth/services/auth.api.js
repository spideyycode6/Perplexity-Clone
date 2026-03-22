import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export const loginUser = async ({ identifier, password }) => {
    try {
        const response = await api.post("/api/auth/login", {identifier, password});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async ({ username, email, password, confirmPassword }) => {
    try {
        const response = await api.post("/api/auth/register", {
            username,
            email,
            password,
            confirmPassword,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getMe = async () => {
    try {
        const response = await api.get("/api/auth/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};