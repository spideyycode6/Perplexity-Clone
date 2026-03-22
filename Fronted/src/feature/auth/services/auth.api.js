import axios from "axios";

/** Empty string = same origin when the SPA is served by the backend (production). */
const baseURL =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? "http://localhost:3000" : "");

const api = axios.create({
    baseURL,
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