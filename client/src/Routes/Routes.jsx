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
import PrivateRoutes from "./PrivateRoutes";
import MyBids from "../Pages/MyBids";
import BidRequests from "../Pages/BidRequests";
import AllCars from "../Pages/AllCars";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage />,
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
        element: (
          <PrivateRoutes>
            <CarDetails />
          </PrivateRoutes>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/car/${params.id}`, {
            credentials: "include",
          }),
      },

      {
        path: "/add-car",
        element: (
          <PrivateRoutes>
            <AddCar />,
          </PrivateRoutes>
        ),
      },
      {
        path: "/my-posted-cars",
        element: (
          <PrivateRoutes>
            <MyPostedCars />,
          </PrivateRoutes>
        ),
      },
      {
        path: "/updateCar/:id",
        element: (
          <PrivateRoutes>
            <UpdateCar />,
          </PrivateRoutes>
        ),
      },
      {
        path: "/auctions",
        element: <Auctions />,
      },
      {
        path: '/my-bids',
        element: <PrivateRoutes>
          <MyBids />
        </PrivateRoutes>
      },
      {
        path: '/bid-requests',
        element: <BidRequests />
      }
      ,
      {
        path: '/all-cars',
        element: <AllCars/>
      }
    ],
  },
]);

export default router;
