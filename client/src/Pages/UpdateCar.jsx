import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const UpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryInputs, setGalleryInputs] = useState([0]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [features, setFeatures] = useState("");
  const [dateline, setDateline] = useState(null);

  // constants
  const CAR_CATEGORIES = ["Sedan", "SUV", "Truck", "Coupe", "Convertible", "Hatchback", "Wagon", "Minivan"];
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

  // fetch single car by id
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/car/${id}`);
        setCar(data);
        setFeatures(data.features?.join(", ") || "");
        setGalleryImages(data.gallery_images || []);
        setDateline(new Date(data.dateline));
      } catch (err) {
        console.error("Error loading car:", err);
        toast.error("Failed to load car data");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // add new gallery input
  const handleAddInput = () => {
    setGalleryInputs((prev) => [...prev, prev.length]);
  };

  const handleGalleryURLChange = (e, index) => {
    const url = e.target.value;
    setGalleryImages((prev) => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };

  // submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedCar = {
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
      features: features.split(",").map((f) => f.trim()).filter(Boolean),
      rating: parseFloat(form.rating.value) || 0,
      buyer: car.buyer || {
        email: user?.email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    };

    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/car/${id}`, updatedCar);
      console.log(data);
      toast.success("Car updated successfully!");
      navigate("/my-posted-cars");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update car!");
    }
  };

  if (loading) return <p className="mt-10 text-center text-gray-600">Loading car data...</p>;
  if (!car) return <p className="mt-10 text-center text-gray-600">No car found!</p>;

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-100">
      <section className="w-full max-w-4xl p-6 mx-auto bg-white shadow-2xl rounded-xl">
        <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">
          Update Car 🚗
        </h2>

        <form onSubmit={handleSubmit}>
          {/* --- Basic Details --- */}
          <div className="p-6 mb-8 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* brand */}
              <div>
                <label htmlFor="brand_name" className="text-gray-700">Brand Name</label>
                <select
                  id="brand_name"
                  name="brand_name"
                  defaultValue={car.brand_name}
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* model */}
              <div>
                <label htmlFor="model_name" className="text-gray-700">Model Name</label>
                <input
                  id="model_name"
                  name="model_name"
                  type="text"
                  defaultValue={car.model_name}
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                />
              </div>

              {/* country */}
              <div>
                <label htmlFor="country" className="text-gray-700">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  defaultValue={car.country}
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                />
              </div>

              {/* category */}
              <div>
                <label htmlFor="category" className="text-gray-700">Category</label>
                <select
                  id="category"
                  name="category"
                  defaultValue={car.category}
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                >
                  {CAR_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* status */}
              <div>
                <label htmlFor="availability_status" className="text-gray-700">Availability</label>
                <select
                  id="availability_status"
                  name="availability_status"
                  defaultValue={car.availability_status}
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                >
                  {AVAILABILITY.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* date */}
              <div>
                <label className="text-gray-700">Dateline</label>
                <DatePicker
                  selected={dateline}
                  onChange={setDateline}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 text-black border rounded-md"
                />
              </div>

              {/* description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={car.description}
                  rows="3"
                  required
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>

          {/* --- Pricing & Media --- */}
          <div className="p-6 mb-8 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">Pricing & Media</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="min_price" className="text-gray-700">Min Price</label>
                <input
                  id="min_price"
                  name="min_price"
                  type="number"
                  defaultValue={car.price_range?.min_price}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="max_price" className="text-gray-700">Max Price</label>
                <input
                  id="max_price"
                  name="max_price"
                  type="number"
                  defaultValue={car.price_range?.max_price}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="main_image" className="text-gray-700">Main Image URL</label>
                <input
                  id="main_image"
                  name="main_image"
                  type="url"
                  defaultValue={car.main_image}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                />
              </div>

              {/* gallery */}
              <div className="md:col-span-2">
                <div className="flex justify-between">
                  <label className="text-gray-700">Gallery Images</label>
                  <button
                    type="button"
                    onClick={handleAddInput}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <FaPlus /> Add Image
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleGalleryURLChange(e, index)}
                        className="flex-1 px-3 py-2 text-black border rounded-md"
                      />
                      {url && <img src={url} alt="" className="object-cover w-20 h-20 rounded-md" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- Technical --- */}
          <div className="p-6 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">Technical Specs</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="engine_specs" className="text-gray-700">Engine</label>
                <select
                  id="engine_specs"
                  name="engine_specs"
                  defaultValue={car.engine_specs}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                >
                  {ENGINE_SPECS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="transmission" className="text-gray-700">Transmission</label>
                <select
                  id="transmission"
                  name="transmission"
                  defaultValue={car.transmission}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                >
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="fuel_type" className="text-gray-700">Fuel Type</label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  defaultValue={car.fuel_type}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="rating" className="text-gray-700">Rating</label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  defaultValue={car.rating}
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="features" className="text-gray-700">Features</label>
                <textarea
                  id="features"
                  name="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows="2"
                  className="block w-full px-4 py-2 mt-2 text-black border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>

          {/* submit */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-10 py-3 font-semibold text-white uppercase bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Update Car
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateCar;
