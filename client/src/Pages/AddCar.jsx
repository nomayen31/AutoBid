import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const AddCar = () => {
  const navigate = useNavigate();
  const {user} = useAuth()

  const [rating, setRating] = useState(0);
  const [features, setFeatures] = useState(
    "Hill Assist Control, Trailer Sway Control, Touchscreen Display, Rear Camera, 4WD"
  );
  const [galleryInputs, setGalleryInputs] = useState([0]); // Track dynamic fields
  const [galleryImages, setGalleryImages] = useState([]); // Store URLs
  const [dateline, setDateline] = useState(null);
  const [uploading, setUploading] = useState(false);

  const CAR_CATEGORIES = [
    "Sedan",
    "SUV",
    "Truck",
    "Coupe",
    "Convertible",
    "Hatchback",
    "Wagon",
    "Minivan",
  ];
  const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric"];
  const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
  const AVAILABILITY = ["Available", "Coming Soon", "Sold Out"];
  const BRANDS = ["Toyota", "BMW", "Tesla", "Mercedes-Benz", "Ford", "Hyundai"];
  const ENGINE_SPECS = [
    "1.5L 4-Cylinder Gasoline",
    "2.0L Turbocharged Inline-4",
    "2.5L 4-Cylinder Hybrid",
    "3.0L V6 Twin-Turbo",
    "Electric Dual Motor AWD",
    "Electric Single Motor RWD",
    "3.5L Diesel Turbocharged",
    "4.0L V8 Petrol",
  ];

  // ➕ Add new gallery image input field
  const handleAddInput = () => {
    setGalleryInputs((prev) => [...prev, prev.length]);
  };

  // 🖼️ Handle URL input for gallery images
  const handleGalleryURLChange = (e, index) => {
    const url = e.target.value;
    setGalleryImages((prev) => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const featuresArray = features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    const carData = {
      brand_name: form.brand_name.value,
      model_name: form.model_name.value,
      country: form.country.value,
      description: form.description.value,
      category: form.category.value,
      availability_status: form.availability_status.value,
      dateline,
      price_range: {
        min_price: parseFloat(form.min_price.value),
        max_price: parseFloat(form.max_price.value),
      },
      main_image: form.main_image.value,
      gallery_images: galleryImages.filter(Boolean),
      engine_specs: form.engine_specs.value,
      transmission: form.transmission.value,
      fuel_type: form.fuel_type.value,
      features: featuresArray,
      rating: parseFloat(form.rating.value) || 0,
      buyer: {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/car`,
        carData
      );
      console.log(data);
      toast.success("Car added successfully!");
      navigate("/my-posted-cars");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add car. Please try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-100">
      <section className="w-full max-w-4xl p-6 mx-auto bg-white shadow-2xl rounded-xl">
        <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">
          Add a New Car 🚗
        </h2>

        <form onSubmit={handleSubmit}>
          {/* --- Basic Details --- */}
          <div className="p-6 mb-8 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="brand_name" className="text-gray-700">
                  Brand Name
                </label>
                <select
                  id="brand_name"
                  name="brand_name"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Brand</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="model_name" className="text-gray-700">
                  Model Name
                </label>
                <input
                  id="model_name"
                  name="model_name"
                  type="text"
                  required
                  placeholder="e.g., Camry"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label htmlFor="country" className="text-gray-700">
                  Country of Origin
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  placeholder="e.g., Japan"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label htmlFor="category" className="text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Category</option>
                  {CAR_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="availability_status" className="text-gray-700">
                  Availability
                </label>
                <select
                  id="availability_status"
                  name="availability_status"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  {AVAILABILITY.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700">Dateline</label>
                <DatePicker
                  selected={dateline}
                  onChange={setDateline}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select dateline"
                  className="w-full p-2 text-black border rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="A refined mid-size sedan combining comfort, reliability..."
                  rows="3"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                ></textarea>
              </div>
            </div>
          </div>

          {/* --- Pricing & Media --- */}
          <div className="p-6 mb-8 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">
              Pricing & Media
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="min_price" className="text-gray-700">
                  Minimum Price ($)
                </label>
                <input
                  id="min_price"
                  name="min_price"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g., 26000"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="max_price" className="text-gray-700">
                  Maximum Price ($)
                </label>
                <input
                  id="max_price"
                  name="max_price"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g., 35000"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="main_image" className="text-gray-700">
                  Main Image URL
                </label>
                <input
                  id="main_image"
                  name="main_image"
                  type="url"
                  required
                  placeholder="https://example.com/toyota-camry-main.jpg"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* 🔗 Dynamic Gallery URL Input Section */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Gallery Image URLs</label>
                  <button
                    type="button"
                    onClick={handleAddInput}
                    className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white transition-all bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <FaPlus /> Add Image
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {galleryInputs.map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
                    >
                      <input
                        type="url"
                        placeholder="Paste image URL here"
                        value={galleryImages[index] || ""}
                        onChange={(e) => handleGalleryURLChange(e, index)}
                        className="flex-1 px-3 py-2 text-black border rounded-md outline-none focus:border-blue-500"
                      />
                      {galleryImages[index] && (
                        <img
                          src={galleryImages[index]}
                          alt={`preview-${index}`}
                          className="object-cover w-20 h-20 ml-4 rounded-md shadow-md"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- Technical Specs & Features --- */}
          <div className="p-6 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">
              Technical Specs & Features
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="engine_specs" className="text-gray-700">
                  Engine Specs
                </label>
                <select
                  id="engine_specs"
                  name="engine_specs"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Engine Type</option>
                  {ENGINE_SPECS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="transmission" className="text-gray-700">
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Transmission Type</option>
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fuel_type" className="text-gray-700">
                  Fuel Type
                </label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Fuel Type</option>
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="text-gray-700">
                  Rating (0.0 to 5.0)
                </label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="e.g., 4.7"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="features" className="text-gray-700">
                  Key Features (Comma-Separated)
                </label>
                <textarea
                  id="features"
                  name="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Feature 1, Feature 2, Feature 3, ..."
                  rows="2"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-10 py-3 font-semibold text-white uppercase transition-colors duration-300 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Add Car"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddCar;
