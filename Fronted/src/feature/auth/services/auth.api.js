import axios from "axios";
import { getApiBaseURL } from "../../../config/apiOrigin.js";

const api = axios.create({
    baseURL: getApiBaseURL(),
    withCredentials: true,
    timeout: 90_000,
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
        const response = await api.post(
            "/api/auth/register",
            {
                username,
                email,
                password,
                confirmPassword,
            },
            { timeout: 120_000 }
        );
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