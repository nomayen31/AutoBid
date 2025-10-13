import React, { useContext, useState, useRef, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  FaTachometerAlt,
  FaCogs,
  FaGasPump,
  FaStar,
  FaDollarSign,
  FaGlobe,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaCommentDots,
  FaAt,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { gsap } from "gsap";

const CarDetails = () => {
  const { user } = useContext(AuthContext);
  const car = useLoaderData();
  const containerRef = useRef(null);

  // ✨ Animate page load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
      gsap.from(".img-pop", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-gray-700 bg-white">
        No car data found 😔
      </div>
    );

  const {
    brand_name,
    country,
    model_name,
    description,
    category,
    price_range,
    features,
    engine_specs,
    transmission,
    fuel_type,
    rating,
    main_image,
    gallery_images,
    availability_status,
    _id,
    buyer,
  } = car;

  const [currentMainImage, setCurrentMainImage] = useState(main_image);
  const formRef = useRef(null);
  const isAvailable = availability_status === "Available";

  const handleGalleryClick = (imageURL) => setCurrentMainImage(imageURL);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (user?.email === car?.buyer?.email)
      return toast.error("Action Not Permitted");

    const form = formRef.current;
    const price = parseFloat(form.price.value);
    const minPrice = parseFloat(price_range?.min_price || 0);
    if (price < minPrice)
      return toast.error(`Your bid must be at least $${minPrice}`);

    const bidData = {
      carId: _id,
      model_name,
      email: form.email.value,
      price,
      dateline: form.dateline.value,
      comments: form.comments.value,
      status: "Pending",
      brand_name,
      buyer_email: car?.buyer?.email,
    };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/bid`, bidData);
      toast.success("Bid placed successfully!");
      form.reset();
    } catch {
      toast.error("Failed to place bid. Try again!");
    }
  };

  const InfoPill = ({ icon: Icon, title, value, className = "" }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm"
    >
      <Icon className={`w-5 h-5 mr-3 ${className}`} />
      <div>
        <span className="block text-sm font-medium text-gray-500">{title}</span>
        <span className="text-lg font-semibold text-gray-800">{value}</span>
      </div>
    </motion.div>
  );

  const InputField = ({
    label,
    name,
    type = "text",
    value,
    readOnly = false,
    icon: Icon,
    placeholder = "",
  }) => (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor={name}
        className="flex items-center text-sm font-medium text-gray-600"
      >
        {Icon && <Icon className="w-4 h-4 mr-2 text-blue-500" />}
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={value}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:border-blue-500 transition ${readOnly ? "bg-gray-100 text-gray-500" : "text-gray-800"
          }`}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-white text-gray-900 px-4 py-12 md:px-10"
    >
      {/* Header */}
      <div className="fade-up flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900">
            {model_name}
          </h1>
          <p className="mt-2 text-xl text-gray-700">
            <span className="font-bold text-blue-600">{brand_name}</span> (
            {country}) —{" "}
            <span className="font-semibold text-purple-600">{category}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Car ID : {_id}</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-6 md:mt-0 text-center md:text-right"
        >
          <p className="text-3xl font-bold text-green-600 flex items-center justify-center md:justify-end">
            <FaDollarSign className="mr-1" />
            {price_range?.min_price?.toLocaleString()} –{" "}
            {price_range?.max_price?.toLocaleString()}
          </p>
          <span
            className={`inline-flex items-center px-4 py-1 mt-2 rounded-full text-sm font-semibold ${isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
              }`}
          >
            {isAvailable ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaTimesCircle className="mr-2" />
            )}
            {availability_status}
          </span>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-10 mb-14">
        {/* Main Image + Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <Zoom>
            <motion.img
              src={currentMainImage}
              alt={model_name}
              className="img-pop w-full rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            />
          </Zoom>
          {gallery_images?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Gallery Views
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[main_image, ...gallery_images].map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    onClick={() => handleGalleryClick(img)}
                    className={`cursor-pointer rounded-lg h-28 object-cover border-2 transition ${img === currentMainImage
                        ? "border-blue-500"
                        : "border-gray-200"
                      }`}
                    whileHover={{ scale: 1.05 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4 fade-up">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Key Highlights
          </h2>
          <InfoPill
            icon={FaTachometerAlt}
            title="Engine"
            value={engine_specs}
            className="text-red-500"
          />
          <InfoPill
            icon={FaCogs}
            title="Transmission"
            value={transmission}
            className="text-indigo-500"
          />
          <InfoPill
            icon={FaGasPump}
            title="Fuel"
            value={fuel_type}
            className="text-orange-500"
          />
          <InfoPill
            icon={FaTag}
            title="Category"
            value={category}
            className="text-purple-500"
          />
          <InfoPill
            icon={FaGlobe}
            title="Country"
            value={country}
            className="text-blue-500"
          />
          <div className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
            <FaStar className="text-yellow-500 mr-2" />
            <span className="font-semibold text-gray-800">{rating} / 5</span>
          </div>

          {/* Seller Info */}
          {buyer && (
            <motion.div
              className="p-4 mt-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="flex items-center mb-3 text-lg font-bold text-blue-600">
                <FaUserCircle className="w-5 h-5 mr-2 text-blue-500" />
                Seller Information
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={
                    buyer.photo ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Seller"
                  className="object-cover w-16 h-16 border-2 border-blue-400 rounded-full"
                />
                <div>
                  <p className="text-base font-semibold text-gray-800">
                    {buyer.name || "Unknown Seller"}
                  </p>
                  <p className="text-sm text-gray-600">{buyer.email}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bid Form */}
      <motion.div
        className="p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-md mb-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-blue-600 border-b pb-3 mb-6">
          Place a Bid 💰
        </h2>
        <form ref={formRef} onSubmit={handlePlaceBid} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Your Bid Price"
              name="price"
              type="number"
              icon={FaDollarSign}
              placeholder={`Min ${price_range?.min_price?.toLocaleString()}`}
            />
            <InputField
              label="Your Email"
              name="email"
              type="email"
              value={user?.email || ""}
              readOnly
              icon={FaAt}
            />
            <InputField
              label="Dateline"
              name="dateline"
              type="date"
              icon={FaCalendarAlt}
            />
          </div>
          <div>
            <label
              htmlFor="comments"
              className="flex items-center text-sm font-medium text-gray-600 mb-2"
            >
              <FaCommentDots className="text-blue-500 mr-2" /> Comments (Optional)
            </label>
            <textarea
              id="comments"
              name="comments"
              rows="4"
              className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Any additional comments for your bid..."
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Place Bid
          </motion.button>
        </form>
      </motion.div>

      {/* Description + Features */}
      <div className="grid md:grid-cols-3 gap-10">
        <motion.div
          className="md:col-span-2 p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>

          {/* --- Detailed Car Overview --- */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-800 bg-gray-50 mt-8 rounded-xl">
            {/* Column 1: Overview & Design */}
            <section className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-blue-700 mb-4 border-l-4 border-blue-400 pl-4">
                Vehicle Overview & Design
              </h2>
              <p className="mb-6 leading-relaxed text-lg">
                This stunning <strong>{ brand_name}</strong> represents the
                pinnacle of modern automotive engineering, blending breathtaking
                aesthetics with uncompromising function.
              </p>

              <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-3">
                Key Design Highlights:
              </h3>
              <ul className="space-y-2 pl-5">
                <li>
                  <span className="text-blue-500 mr-2">•</span> Dynamic proportions with
                  low-slung hood and wide track.
                </li>
                <li>
                  <span className="text-blue-500 mr-2">•</span> Adaptive LED headlamps and
                  signature DRLs.
                </li>
                <li>
                  <span className="text-blue-500 mr-2">•</span> 20-inch diamond-cut alloy
                  wheels.
                </li>
              </ul>
            </section>

            {/* Column 2: Quick Specs */}
            <aside className="lg:col-span-1 bg-gray-200 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Quick Specifications
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span>Engine:</span>
                  <span className="font-medium">2.0L Turbocharged I4</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span>Horsepower:</span>
                  <span className="font-medium">300 hp</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span>Transmission:</span>
                  <span className="font-medium">8-Speed DCT</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 pb-2">
                  <span>Mileage:</span>
                  <span className="font-medium">28 MPG Combined</span>
                </div>
                <div className="flex justify-between">
                  <span>Odometer:</span>
                  <span className="font-medium">12,500 miles</span>
                </div>
              </div>
            </aside>
          </div>

          {/* --- Performance Section --- */}
          <section className="p-6 sm:p-10 bg-gray-100 border-t border-gray-200 mt-10 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              ⚡ Dynamic Performance
            </h2>
            <p className="leading-relaxed mb-4">
              Performance is at the heart of the [Make] philosophy. The 2.0L engine
              delivers exhilarating power with refined efficiency.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                Adaptive Suspension
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                Selectable Drive Modes
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                High-Performance Brakes
              </span>
            </div>
          </section>

          {/* --- Interior & Tech --- */}
          <section className="p-6 sm:p-10 bg-gray-50 rounded-xl mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🖥️ Luxury & Technology</h2>
            <div className="grid md:grid-cols-2 gap-8 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-3">Refined Interior Comfort</h3>
                <p className="mb-4">
                  The cabin is a masterclass in craftsmanship, upholstered in Nappa
                  leather with open-pore wood trim.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Heated and Ventilated Sport Seats</li>
                  <li>Panoramic Sunroof</li>
                  <li>64-Color Ambient Lighting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Intuitive Connectivity</h3>
                <p className="mb-4">
                  Stay connected with a 12.3-inch digital cockpit and premium surround
                  sound.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Wireless Apple CarPlay® & Android Auto™</li>
                  <li>Burmester 3D Surround Sound</li>
                  <li>Smartphone Wireless Charging Pad</li>
                </ul>
              </div>
            </div>
          </section>

          {/* --- Safety & History --- */}
          <section className="p-6 sm:p-10 bg-gray-100 border-t border-gray-200 mt-10 rounded-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">🛡️ Safety & Provenance</h2>
            <div className="grid md:grid-cols-3 gap-8 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold mb-3">Driver Assistance</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Blind Spot Assist</li>
                  <li>Lane Keep Assist</li>
                  <li>Active Distance Control</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Vehicle History</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>1-Owner Vehicle</li>
                  <li>Clean CarFax Report</li>
                  <li>Full Service History</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Why This Car?</h3>
                <p>
                  This specific model includes the AMG Line Package, making it one of the
                  most desirable configurations on the market.
                </p>
              </div>
            </div>
          </section>


        </motion.div>

        <motion.div
          className="p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
            Key Features
          </h3>
          <ul className="space-y-3 text-gray-700">
            {features?.map((f, i) => (
              <li key={i} className="flex items-start">
                <FaCheckCircle className="text-blue-500 mt-1 mr-2" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CarDetails;
