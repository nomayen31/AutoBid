import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CarCard from "./CarCard";
import useAxiosSecure from "../hooks/useAxiosSecure";

const TabCategories = () => {
  const axiosSecure = useAxiosSecure();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axiosSecure.get("/cars");
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching car data:", err);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [axiosSecure]);

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

  if (!cars.length)
    return (
      <div className="min-h-screen py-20 text-lg text-center text-gray-400 bg-gray-950">
        No cars available at the moment.
      </div>
    );

  const brands = [...new Set(cars.map((car) => car.brand_name))];

  return (
    <div className="w-full text-white bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="px-6 py-16 mx-auto max-w-7xl">
        <Tabs>
          {/* --- Header Section --- */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-yellow-400 md:text-5xl drop-shadow-lg">
              Browse Cars by Brand
            </h1>
            <p className="max-w-2xl mx-auto text-base text-gray-400 md:text-lg">
              Explore the world’s most iconic car brands and their signature models — performance, luxury, and innovation in one place.
            </p>
          </div>

          {/* --- Tab List --- */}
          <div className="flex justify-center mb-12">
            <TabList className="flex flex-wrap justify-center gap-3 bg-gray-900/80 p-3 rounded-full shadow-[0_0_25px_-5px_rgba(255,255,0,0.2)] border border-gray-800 backdrop-blur-sm">
              {brands.map((brand) => (
                <Tab
                  key={brand}
                  className="px-5 py-2 text-sm font-medium text-gray-300 transition-all duration-300 bg-gray-800 rounded-full cursor-pointer md:text-base hover:bg-yellow-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 animate-fadeIn">
                {cars
                  .filter((car) => car.brand_name === brand)
                  .map((car) => (
                    <CarCard key={car._id} car={car} />
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
