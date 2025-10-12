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
    return <div className="py-10 text-center text-gray-600">Loading cars...</div>;
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  // ✅ Get all unique brand names
  const brands = [...new Set(cars.map((car) => car.brand_name))];

  return (
    <Tabs>
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
          Browse Cars by Brand
        </h1>

        <p className="max-w-2xl mx-auto my-6 text-center text-gray-500">
          Explore top car brands and discover their latest models.
        </p>

        {/* ✅ Tab List for Brand Names */}
        <TabList>
          {brands.map((brand) => (
            <Tab key={brand}>{brand}</Tab>
          ))}
        </TabList>

        {/* ✅ Tab Panels (Each Brand’s Cars) */}
        {brands.map((brand) => (
          <TabPanel key={brand}>
            <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
              {cars
                .filter((car) => car.brand_name === brand)
                .map((car, index) => (
                  <CarCard key={index} car={car} />
                ))}
            </div>
          </TabPanel>
        ))}
      </div>
    </Tabs>
  );
};

export default TabCategories;
