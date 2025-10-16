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
  const [sort, setSort] = useState("");

  const fetchCars = async ({ page = currentPage, filterVal = filter, searchVal = searchTerm, size = itemsPerPage, sortVal = sort } = {}) => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/all-cars?page=${page}&size=${size}&filter=${encodeURIComponent(filterVal)}&search=${encodeURIComponent(searchVal)}&sort=${encodeURIComponent(sortVal)}`;
      const res = await axios.get(url);
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching car data:", err);
      setError("Failed to load car data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCount = async ({ brandVal = filter, searchVal = searchTerm } = {}) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/cars-count?brand=${encodeURIComponent(brandVal)}&search=${encodeURIComponent(searchVal)}`;
      const res = await axios.get(url);
      setCount(res.data.count);
    } catch (err) {
      console.error("Error fetching car count:", err);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchCount();
  }, [currentPage, itemsPerPage, filter, sort]);

  const totalPages = count > 0 ? Math.ceil(count / itemsPerPage) : 0;
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const handleSearchClick = async () => {
    setCurrentPage(0);
    await fetchCars({ page: 0, searchVal: searchTerm });
    await fetchCount({ brandVal: filter, searchVal: searchTerm });
  };

  const handleReset = async () => {
    setCurrentPage(0);
    setItemsPerPage(4);
    setFilter("");
    setSearchTerm("");
    setSort("");
    await fetchCars({ page: 0, filterVal: "", searchVal: "", size: 4, sortVal: "" });
    await fetchCount({ brandVal: "", searchVal: "" });
  };

  if (loading)
    return (
      <div className="min-h-screen py-20 text-lg text-center text-gray-400 animate-pulse bg-gray-950">
        Loading cars...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen py-20 text-lg font-medium text-center text-red-500 bg-gray-950">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-10 min-h-[calc(100vh-306px)] flex flex-col justify-between">
      <div className="px-6 py-5 mb-8 bg-white shadow-md rounded-2xl">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <select
            onChange={(e) => {
              setFilter(e.currentTarget.value);
              setCurrentPage(0);
            }}
            value={filter}
            className="w-full px-4 py-3 text-gray-700 transition border border-gray-300 shadow-sm md:w-auto rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Tesla">Tesla</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Ford">Ford</option>
            <option value="Hyundai">Hyundai</option>
          </select>

          <div className="flex w-full overflow-hidden transition border border-gray-300 md:w-1/2 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
            <input
              className="w-full px-5 py-3 text-gray-700 placeholder-gray-400 bg-white outline-none"
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearchClick}
              className="px-5 font-medium tracking-wide text-white transition bg-blue-600 hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          <select
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(0);
            }}
            value={sort}
            className="w-full px-4 py-3 text-gray-700 transition border border-gray-300 shadow-sm md:w-auto rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Sort by Deadline</option>
            <option value="asc">Ascending</option>
            <option value="dsc">Descending</option>
          </select>

          <button
            onClick={handleReset}
            className="px-6 py-3 font-semibold text-white transition bg-gray-700 rounded-xl hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 text-center text-gray-700 animate-fadeIn">
          <div className="mb-6 w-44 h-44">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-full h-full text-blue-500 opacity-80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5h14l2 5M5 13v6a1 1 0 001 1h1a1 1 0 001-1v-2h8v2a1 1 0 001 1h1a1 1 0 001-1v-6M9 16h6" />
              <circle cx="7.5" cy="17.5" r="1.5" />
              <circle cx="16.5" cy="17.5" r="1.5" />
            </svg>
          </div>

          <h2 className="mb-3 text-3xl font-semibold tracking-wide text-gray-800">No Cars Found</h2>
          <p className="max-w-md mb-6 leading-relaxed text-gray-500">We couldn’t find any cars that match your filters. Try adjusting your search or reach out to our team — we’ll help you find your perfect ride.</p>

          <Link to="/contact" className="px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 hover:shadow-lg">Contact AutoBid</Link>
        </div>
      )}

      {count > itemsPerPage && totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button
            disabled={currentPage === 0}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 0));
            }}
            className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white disabled:opacity-50"
          >
            Prev
          </button>

          {pages.map((num) => (
            <button
              key={num}
              onClick={async () => {
                setCurrentPage(num);
                await fetchCars({ page: num });
                await fetchCount({ brandVal: filter, searchVal: "" });
              }}
              className={`px-4 py-2 rounded-lg border transition ${num === currentPage ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white border-gray-300"}`}
            >
              {num + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
            }}
            className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-blue-500 hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCars;
