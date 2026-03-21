import { useDispatch } from "react-redux";
import { loginUser, registerUser, getMe } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            const data = await registerUser({email,username,password});

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))

        }finally{
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

    async function handleGetMe(){
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"))

        }finally{
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