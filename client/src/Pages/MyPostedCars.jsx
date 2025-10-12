import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaCarSide } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyPostedCars = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's posted cars
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/cars/${user.email}`)
        .then((res) => {
          setCars(res.data);
        })
        .catch((error) => {
          console.error("Error fetching cars:", error);
          toast.error("Failed to load cars");
        })
        .finally(() => setLoading(false));
    }
  }, [user?.email]);

  // Delete car
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/car/${id}`);
      setCars((prev) => prev.filter((c) => c._id !== id));
      toast.success("Car deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car.");
    }
  };

  return (
    <section className="container px-4 pt-12 mx-auto">
      <div className="flex items-center mb-6 gap-x-3">
        <FaCarSide className="text-2xl text-blue-600" />
        <h2 className="text-lg font-semibold text-White">My Posted Cars</h2>
        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
          {cars.length} Cars
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading your cars...</p>
      ) : cars.length === 0 ? (
        <p className="text-gray-600">You haven't posted any cars yet.</p>
      ) : (
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 shadow-lg md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Title
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Price Range
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Description
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {cars.map((car) => (
                      <tr
                        key={car._id}
                        className="transition-all hover:bg-gray-50"
                      >
                        {/* Title + Image */}
                        <td className="flex items-center px-4 py-4 space-x-3 whitespace-nowrap">
                          <img
                            src={car.main_image}
                            alt={car.model_name}
                            className="object-cover border border-gray-200 rounded-md w-14 h-14"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {car.model_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {car.category}
                            </p>
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(car.dateline).toLocaleDateString("en-GB")}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                          ${car.price_range?.min_price?.toLocaleString()} - $
                          {car.price_range?.max_price?.toLocaleString()}
                        </td>

                        {/* Brand */}
                        <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {car.brand_name}
                        </td>

                        {/* Description */}
                        <td
                          className="max-w-xs px-4 py-4 text-sm text-gray-500 truncate"
                          title={car.description}
                        >
                          {car.description?.slice(0, 70)}...
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              car.availability_status === "Available"
                                ? "bg-green-100 text-green-700"
                                : car.availability_status === "Coming Soon"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {car.availability_status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-4">
                            <button
                              onClick={() => handleDelete(car._id)}
                              className="text-gray-500 transition-colors hover:text-red-600"
                              title="Delete Car"
                            >
                              <FaTrashAlt />
                            </button>
                            <Link
                              to={`/updateCar/${car._id}`}
                              className="text-gray-500 transition-colors hover:text-yellow-600"
                              title="Edit Car"
                            >
                              <FaEdit />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyPostedCars;
