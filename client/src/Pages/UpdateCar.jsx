import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";

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

const UpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [features, setFeatures] = useState("");
  const [dateline, setDateline] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axiosSecure.get(`/car/${id}`);
        setCar(data);
        setFeatures(data.features?.join(", ") || "");
        setGalleryImages(data.gallery_images || []);
        setDateline(data.dateline ? new Date(data.dateline) : null);
      } catch (err) {
        console.error("Error loading car:", err);
        toast.error("Failed to load car data");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, axiosSecure]);

  const handleAddGalleryInput = () => {
    setGalleryImages((prev) => [...prev, ""]);
  };

  const handleGalleryURLChange = (index, value) => {
    setGalleryImages((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.model_name.value || !form.brand_name.value) {
      toast.error("Please fill all required fields!");
      return;
    }

    const updatedCar = {
      brand_name: form.brand_name.value,
      model_name: form.model_name.value,
      country: form.country.value,
      description: form.description.value,
      category: form.category.value,
      availability_status: form.availability_status.value,
      dateline: dateline ? dateline.toISOString().split("T")[0] : car.dateline,
      price_range: {
        min_price: parseFloat(form.min_price.value),
        max_price: parseFloat(form.max_price.value),
      },
      main_image: form.main_image.value,
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

    // Only include gallery_images if at least one non-empty URL exists
    const nonEmptyGallery = galleryImages.filter(Boolean);
    if (nonEmptyGallery.length > 0) {
      updatedCar.gallery_images = nonEmptyGallery;
    }

    try {
      setUploading(true);
      const { data } = await axiosSecure.put(`/car/${id}`, updatedCar);
      if (data.modifiedCount || data.acknowledged) {
        toast.success("Car updated successfully!");
        navigate("/my-posted-cars");
      } else {
        toast.error("No changes detected!");
      }
    } catch (err) {
      console.error("Error updating car:", err);
      toast.error("Failed to update car!");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="mt-10 text-center text-gray-600">Loading car data...</p>;
  if (!car) return <p className="mt-10 text-center text-gray-600">No car found!</p>;

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gray-100">
      <section className="w-full max-w-4xl p-6 mx-auto bg-white shadow-2xl rounded-xl">
        <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">Update Car 🚗</h2>

        <form onSubmit={handleSubmit}>
          {/* Basic Details */}
          <div className="p-6 mb-8 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">Basic Details</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-gray-700">Brand Name</label>
                <select name="brand_name" defaultValue={car.brand_name} className="block w-full px-4 py-2 mt-2 border rounded-md">
                  {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-700">Model Name</label>
                <input name="model_name" defaultValue={car.model_name} required className="block w-full px-4 py-2 mt-2 border rounded-md" />
              </div>
              <div>
                <label className="text-gray-700">Country</label>
                <input name="country" defaultValue={car.country} required className="block w-full px-4 py-2 mt-2 border rounded-md" />
              </div>
              <div>
                <label className="text-gray-700">Category</label>
                <select name="category" defaultValue={car.category} className="block w-full px-4 py-2 mt-2 border rounded-md">
                  {CAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-700">Availability</label>
                <select name="availability_status" defaultValue={car.availability_status} className="block w-full px-4 py-2 mt-2 border rounded-md">
                  {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-700">Dateline</label>
                <DatePicker selected={dateline} onChange={setDateline} dateFormat="yyyy-MM-dd" className="w-full p-2 border rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-700">Description</label>
                <textarea name="description" defaultValue={car.description} rows="3" className="block w-full px-4 py-2 mt-2 border rounded-md"></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Media */}
          <div className="p-6 mb-8 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">Pricing & Media</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input name="min_price" type="number" defaultValue={car.price_range?.min_price} className="block w-full px-4 py-2 mt-2 border rounded-md" />
              <input name="max_price" type="number" defaultValue={car.price_range?.max_price} className="block w-full px-4 py-2 mt-2 border rounded-md" />
              <input name="main_image" type="url" defaultValue={car.main_image} className="block w-full px-4 py-2 mt-2 border rounded-md md:col-span-2" />

              <div className="md:col-span-2">
                <div className="flex justify-between">
                  <label>Gallery Images</label>
                  <button type="button" onClick={handleAddGalleryInput} className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <FaPlus /> Add
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {galleryImages.map((url, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleGalleryURLChange(i, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      {url && <img src={url} alt="" className="object-cover w-20 h-20 rounded-md" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="p-6 space-y-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="pb-2 text-xl font-semibold text-gray-700 border-b">Technical Specs</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <select name="engine_specs" defaultValue={car.engine_specs} className="block w-full px-4 py-2 mt-2 border rounded-md">
                {ENGINE_SPECS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              <select name="transmission" defaultValue={car.transmission} className="block w-full px-4 py-2 mt-2 border rounded-md">
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select name="fuel_type" defaultValue={car.fuel_type} className="block w-full px-4 py-2 mt-2 border rounded-md">
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <input name="rating" type="number" step="0.1" defaultValue={car.rating} className="block w-full px-4 py-2 mt-2 border rounded-md" />
              <textarea
                name="features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows="2"
                className="block w-full px-4 py-2 mt-2 border rounded-md md:col-span-2"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button type="submit" disabled={uploading} className="px-10 py-3 font-semibold text-white uppercase bg-blue-600 rounded-full hover:bg-blue-700">
              {uploading ? "Updating..." : "Update Car"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateCar;
