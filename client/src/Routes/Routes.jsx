import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Authentication/Login";
import Registration from "../Pages/Authentication/Registration";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                index: 'true',
                element: <Home></Home>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path:'/registration',
                element: <Registration/>
            }

        ]
    }
]);

export default router;