import React, { useContext, useState, useRef, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-gray-700 bg-white">
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

  // 🖼️ Handle gallery image switch
  const handleGalleryClick = (imageURL) => setCurrentMainImage(imageURL);

  // 💰 Handle Place Bid (with corrected field names)
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (user?.email === buyer?.email)
      return toast.error("You cannot bid on your own car listing.");

    const form = formRef.current;
    const price = parseFloat(form.price.value);
    const minPrice = parseFloat(price_range?.min_price || 0);

    if (price < minPrice)
      return toast.error(`Your bid must be at least $${minPrice}`);

    const bidData = {
      carId: _id,
      model_name,
      bid_price: price,
      dateline: form.dateline.value,
      comments: form.comments.value,
      status: "Pending",
      brand_name,
      seller_email: buyer?.email,   // car owner
      bidder_email: user?.email,    // logged-in user placing the bid
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/bid`, bidData);
      toast.success("Bid placed successfully!");
      form.reset();
      navigate("/my-bids");
    } catch (error) {
      console.error("Bid submission error:", error);
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
        className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:border-blue-500 transition ${
          readOnly ? "bg-gray-100 text-gray-500" : "text-gray-800"
        }`}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen px-4 py-12 text-gray-900 bg-white md:px-10"
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-between mb-10 fade-up md:flex-row">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900">
            {model_name}
          </h1>
          <p className="mt-2 text-xl text-gray-700">
            <span className="font-bold text-blue-600">{brand_name}</span> (
            {country}) —{" "}
            <span className="font-semibold text-purple-600">{category}</span>
          </p>
          <p className="mt-1 text-sm text-gray-400">Car ID: {_id}</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-6 text-center md:mt-0 md:text-right"
        >
          <p className="flex items-center justify-center text-3xl font-bold text-green-600 md:justify-end">
            <FaDollarSign className="mr-1" />
            {price_range?.min_price?.toLocaleString()} –{" "}
            {price_range?.max_price?.toLocaleString()}
          </p>
          <span
            className={`inline-flex items-center px-4 py-1 mt-2 rounded-full text-sm font-semibold ${
              isAvailable
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
      <div className="grid gap-10 lg:grid-cols-3 mb-14">
        {/* Main Image + Gallery */}
        <div className="space-y-6 lg:col-span-2">
          <Zoom>
            <motion.img
              src={currentMainImage}
              alt={model_name}
              className="w-full shadow-lg img-pop rounded-xl"
              whileHover={{ scale: 1.02 }}
            />
          </Zoom>
          {gallery_images?.length > 0 && (
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Gallery Views
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[main_image, ...gallery_images].map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    onClick={() => handleGalleryClick(img)}
                    className={`cursor-pointer rounded-lg h-28 object-cover border-2 transition ${
                      img === currentMainImage
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
          <h2 className="pb-2 text-2xl font-bold text-gray-800 border-b">
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
            <FaStar className="mr-2 text-yellow-500" />
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

      {/* 💸 Bid Form */}
      <motion.div
        className="p-8 border border-gray-200 shadow-md bg-gray-50 rounded-2xl mb-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="pb-3 mb-6 text-3xl font-bold text-blue-600 border-b">
          Place a Bid 💰
        </h2>
        <form ref={formRef} onSubmit={handlePlaceBid} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
              className="flex items-center mb-2 text-sm font-medium text-gray-600"
            >
              <FaCommentDots className="mr-2 text-blue-500" /> Comments (Optional)
            </label>
            <textarea
              id="comments"
              name="comments"
              rows="4"
              className="w-full p-3 text-gray-800 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Any additional comments for your bid..."
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 text-lg font-bold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            Place Bid
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CarDetails;
