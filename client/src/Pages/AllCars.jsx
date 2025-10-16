import { useEffect, useState } from "react";
import CarCard from "../Components/CarCard";
import axios from "axios";
import { Link } from "react-router-dom";

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");

  //  live search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/all-cars?page=${currentPage}&size=${itemsPerPage}&filter=${filter}&search=${debouncedSearch}&sort=${sort}`
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
  }, [currentPage, itemsPerPage, filter, debouncedSearch, sort]);

  // Fetch count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/cars-count?brand=${filter}&search=${debouncedSearch}`;
        const res = await axios.get(url);
        setCount(res.data.count);
      } catch (err) {
        console.error("Error fetching car count:", err);
      }
    };
    fetchCount();
  }, [filter, debouncedSearch]);

  const totalPages = count > 0 ? Math.ceil(count / itemsPerPage) : 0;
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const handleSearchClick = () => {
    setDebouncedSearch(searchTerm);
    setCurrentPage(0);
  };

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
      {/* Filters */}
      <div className="bg-white shadow-md rounded-2xl px-6 py-5 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          {/* Brand Filter */}
          <select
            onChange={(e) => {
              setFilter(e.currentTarget.value);
              setCurrentPage(0);
            }}
            value={filter}
            className="w-full md:w-auto border border-gray-300 text-gray-700 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Tesla">Tesla</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Ford">Ford</option>
            <option value="Hyundai">Hyundai</option>
          </select>

          {/* Search input */}
          <div className="flex w-full md:w-1/2 border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition">
            <input
              className="w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white outline-none"
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearchClick}
              className="px-5 bg-blue-600 text-white font-medium tracking-wide hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Sort */}
          <select
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(0);
            }}
            value={sort}
            className="w-full md:w-auto border border-gray-300 text-gray-700 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">Sort by Deadline</option>
            <option value="asc">Ascending</option>
            <option value="dsc">Descending</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setCurrentPage(0);
              setItemsPerPage(4);
              setFilter("");
              setSearchTerm("");
              setDebouncedSearch("");
              setSort("");
            }}
            className="px-6 py-3 text-white font-semibold bg-gray-700 rounded-xl hover:bg-gray-800 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cars or "No Cars Found" */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-24 text-gray-700 animate-fadeIn">
          {/* Car SVG Illustration */}
          <div className="w-44 h-44 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="currentColor"
              className="w-full h-full text-blue-500 opacity-80"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13l2-5h14l2 5M5 13v6a1 1 0 001 1h1a1 1 0 001-1v-2h8v2a1 1 0 001 1h1a1 1 0 001-1v-6M9 16h6"
              />
              <circle cx="7.5" cy="17.5" r="1.5" />
              <circle cx="16.5" cy="17.5" r="1.5" />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-3xl font-semibold mb-3 tracking-wide text-gray-800">
            No Cars Found
          </h2>
          <p className="max-w-md text-gray-500 leading-relaxed mb-6">
            We couldn’t find any cars that match your filters. Try adjusting your
            search or reach out to our team — we’ll help you find your perfect ride.
          </p>

          {/* Contact Button */}
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
          >
            Contact AutoBid
          </Link>
        </div>
      )}

      {/* Pagination */}
      {count > itemsPerPage && totalPages > 1 && (
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
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
