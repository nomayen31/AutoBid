import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CarCard from "./CarCard";

const TabCategories = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/cars`);
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching car data:", err);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

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

  const brands = [...new Set(cars.map((car) => car.brand_name))];

  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white w-full ">

      <div className="max-w-7xl mx-auto px-6 py-16">
        <Tabs>
          {/* --- Header Section --- */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
              Browse Cars by Brand
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
              Explore the world’s most iconic car brands and their signature models — performance, luxury, and innovation in one place.
            </p>
          </div>

          {/* --- Tab List --- */}
          <div className="flex justify-center mb-12">
            <TabList className="flex flex-wrap justify-center gap-3 bg-gray-900/80 p-3 rounded-full shadow-[0_0_25px_-5px_rgba(255,255,0,0.2)] border border-gray-800 backdrop-blur-sm">
              {brands.map((brand) => (
                <Tab
                  key={brand}
                  className="px-5 py-2 text-sm md:text-base font-medium text-gray-300 bg-gray-800 rounded-full cursor-pointer hover:bg-yellow-400 hover:text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  selectedClassName="!bg-yellow-400 !text-black shadow-lg scale-105"
                >
                  {brand}
                </Tab>
              ))}
            </TabList>
          </div>

          {/* --- Tab Panels --- */}
          {brands.map((brand) => (
            <TabPanel key={brand}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 animate-fadeIn">
                {cars
                  .filter((car) => car.brand_name === brand)
                  .map((car, index) => (
                    <CarCard key={index} car={car} />
                  ))}
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default TabCategories;
