import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Authentication/Login";
import Registration from "../Pages/Authentication/Registration";
import CarDetails from "../Pages/CarDetails";
import AddCar from "../Pages/AddCar";
import ErrorPage from "../Pages/ErrorPage";
import MyPostedCars from "../Pages/MyPostedCars";
import UpdateCar from "../Pages/UpdateCar";
import Auctions from "../Pages/Auctions";

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
      },
      {
        path:'/my-posted-cars',
        element:<MyPostedCars/>
      },
      {
        path:'/updateCar/:id',
        element:<UpdateCar/>
      },
      {
        path:'/auctions',
        element:<Auctions/>
      }
    ],
  },
]);

export default router;
