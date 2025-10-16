import { useEffect, useState } from "react";
import CarCard from "../Components/CarCard";
import axios from "axios";

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // start from 0 for backend skip logic

  // ✅ Fetch paginated cars
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/all-cars?page=${currentPage}&size=${itemsPerPage}`
        );
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching car data:", err);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [currentPage, itemsPerPage]); // run when page or items per page changes

  // ✅ Fetch total count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/cars-count`);
        setCount(res.data.count);
      } catch (err) {
        console.error("Error fetching car count:", err);
      }
    };
    fetchCount();
  }, []);

  const totalPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  if (loading)
    return (
      <div className="py-20 text-center text-gray-400 text-lg animate-pulse bg-gray-950 min-h-screen">
        Loading cars...
      </div>
    );

  if (error)
    return (
      <div className="py-20 text-center text-red-500 text-lg font-medium bg-gray-950 min-h-screen">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-10 min-h-[calc(100vh-306px)] flex flex-col justify-between">
      {/* Top Controls */}
      <div className="bg-white shadow-md rounded-2xl px-6 py-5 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <select
            name="category"
            id="category"
            className="w-full md:w-auto border border-gray-300 text-gray-700 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">Filter by Category</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphics Design">Graphics Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>

          <form className="flex w-full md:w-1/2 border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition">
            <input
              className="w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white outline-none"
              type="text"
              name="search"
              placeholder="Search cars..."
              aria-label="Search cars"
            />
            <button className="px-5 bg-blue-600 text-white font-medium tracking-wide hover:bg-blue-700 transition">
              Search
            </button>
          </form>

          <select
            name="sort"
            id="sort"
            className="w-full md:w-auto border border-gray-300 text-gray-700 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">Sort by Deadline</option>
            <option value="dsc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <button
            onClick={() => {
              setCurrentPage(0);
              setItemsPerPage(2);
            }}
            className="px-6 py-3 text-white font-semibold bg-gray-700 rounded-xl hover:bg-gray-800 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cars Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.length > 0 ? (
          cars.map((car) => <CarCard key={car._id} car={car} />)
        ) : (
          <div className="p-6 text-center border rounded-2xl shadow-sm text-gray-500">
            No cars available yet.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages.length > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white transition disabled:opacity-50"
          >
            Prev
          </button>

          {pages.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-4 py-2 rounded-lg border transition ${
                num === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white border-gray-300"
              }`}
            >
              {num + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCars;
