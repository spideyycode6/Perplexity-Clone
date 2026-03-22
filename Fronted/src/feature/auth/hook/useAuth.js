import { useDispatch } from "react-redux";
import { loginUser, registerUser, getMe } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password, confirmPassword }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await registerUser({
                email,
                username,
                password,
                confirmPassword,
            });
            return data;
        } catch (error) {
            const res = error.response?.data;
            const msg =
                res?.errors?.map((e) => e.message).join(" ") ||
                res?.message ||
                "Something went wrong";
            dispatch(setError(msg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({identifier,password}){
        try {
            dispatch(setLoading(true));
            const data = await loginUser({identifier,password});
            dispatch(setUser(data.user));

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))

        }finally{
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            if (error.response?.status === 401) {
                dispatch(setUser(null));
                dispatch(setError(null));
            } else {
                dispatch(
                    setError(error.response?.data?.message || "Something went wrong")
                );
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        setLoading,
        setError,
        setUser
    }
}