import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Authentication/Login";
import Registration from "../Pages/Authentication/Registration";
import CarDetails from "../Pages/CarDetails";
import AddCar from "../Pages/AddCar";
import ErrorPage from "../Pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement:<ErrorPage/>,
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
         path: "/car/:id",
        element: <CarDetails/>,
        loader:({params})=>fetch(`${import.meta.env.VITE_API_URL}/car/${params.id}`)
      },
      {
        path:'/add-car',
        element:<AddCar/>
      }
    ],
  },
]);

export default router;
