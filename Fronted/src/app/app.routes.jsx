import { createBrowserRouter } from "react-router";
import Login from "../feature/auth/pages/Login";
import Register from "../feature/auth/pages/Register";
import Dashboard from "../feature/chat/pages/Dashboard";
import Protect from "../feature/auth/componets/Protect";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />

    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element:<Protect>
        <Dashboard />
        </Protect>
    }
])