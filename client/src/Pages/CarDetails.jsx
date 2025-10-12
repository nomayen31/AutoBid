import React, { useContext, useState } from "react";
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
  FaCalendarAlt, // Added for date icon
  FaCommentDots, // Added for comments icon
  FaAt, // Added for email icon
} from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";

const CarDetails = () => {
  const { user } = useContext(AuthContext);
  const car = useLoaderData();

  if (!car) {
    return (
      <div className="min-h-screen py-20 text-2xl font-semibold text-center text-gray-300 bg-gray-900">
        No car data found 😔
      </div>
    );
  }

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
  } = car;

  const [currentMainImage, setCurrentMainImage] = useState(main_image);

  const isAvailable = availability_status === "Available";

  const handleGalleryClick = (imageURL) => {
    setCurrentMainImage(imageURL);
  };
  
  // New Bid Submission Handler (currently logs data)
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    const form = e.target;
    const carId = _id;
    const price = parseFloat(form.price.value);
    const email = form.email.value;
    const dateline = form.dateline.value;
    const comments = form.comments.value;

    const bidData = {
      carId: _id,
      model_name,
      bidderEmail: email,
      bidPrice: parseFloat(price),
      dateline,
      comments,
      // You would typically add more data here like bidder name, etc.
    };

    console.log("Bid placed:", bidData);
    alert("Bid submitted successfully! Check the console for data.");
    // In a real application, you would send this data to an API endpoint here.
    form.reset();
  };

  const renderRating = (r) => {
    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="flex items-center space-x-0.5 text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="w-4 h-4" />
        ))}
        {hasHalfStar && <span className="text-yellow-400">★½</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-700" />
        ))}
        <span className="ml-2 font-semibold text-gray-200">{r}</span>
      </span>
    );
  };

  const InfoPill = ({ icon: Icon, title, value, className = "" }) => (
    <div className="flex items-center p-3 bg-gray-800 rounded-lg shadow-sm">
      <Icon className={`w-5 h-5 mr-3 ${className}`} />
      <div>
        <span className="block text-sm font-medium text-gray-400">{title}</span>
        <span className="text-lg font-semibold text-gray-50">{value}</span>
      </div>
    </div>
  );

  const InputField = ({ label, name, type = "text", value, readOnly = false, icon: Icon, placeholder = "" }) => (
    <div className="flex flex-col space-y-2">
        <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-400">
            {Icon && <Icon className="w-4 h-4 mr-2 text-blue-400" />}
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            defaultValue={value}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`w-full p-3 text-gray-100 bg-gray-700 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200 ${
                readOnly ? 'opacity-70 cursor-not-allowed border-gray-600' : 'border-gray-700'
            }`}
        />
    </div>
  );

  return (
    <div className="container min-h-screen px-4 py-12 mx-auto max-w-7xl text-gray-50">
      {/* ---------- Header and Price/Availability ---------- */}
      <div className="flex flex-col items-center justify-between mb-12 space-y-4 md:flex-row md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            {model_name}
          </h1>
          <p className="mt-2 text-xl text-gray-300">
            <span className="font-bold text-blue-400">{brand_name}</span> (
            {country}) — <span className="font-medium text-purple-400">{category}</span>
          </p>
          <p className="mt-1 font-mono text-sm text-gray-500">Car ID: {_id}</p>
        </div>

        <div className="flex flex-col items-center space-y-2 md:items-end">
          <p className="flex items-center text-3xl font-bold text-green-400">
            <FaDollarSign className="w-6 h-6 mr-1" />
            {price_range?.min_price?.toLocaleString()} - {price_range?.max_price?.toLocaleString()}
          </p>
          <div
            className={`px-4 py-1 text-sm font-bold rounded-full shadow-md ${
              isAvailable
                ? "bg-green-700 text-green-100"
                : "bg-red-700 text-red-100"
            } flex items-center`}
          >
            {isAvailable ? <FaCheckCircle className="w-4 h-4 mr-2" /> : <FaTimesCircle className="w-4 h-4 mr-2" />}
            {availability_status}
          </div>
        </div>
      </div>

      {/* --- Horizontal Rule --- */}
      <hr className="my-8 border-gray-700" />

      {/* ---------- Image Gallery and Specs Summary ---------- */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Image - Now uses state variable */}
        <div className="lg:col-span-2">
          <Zoom>
            <img
              src={currentMainImage}
              alt={model_name}
              className="object-cover w-full rounded-xl shadow-2xl transition-shadow duration-300 hover:shadow-3xl max-h-[600px]"
            />
          </Zoom>
        </div>

        {/* Quick Specs Summary */}
        <div className="space-y-4">
          <h2 className="pb-3 mb-2 text-2xl font-bold text-gray-100 border-b border-gray-700">Key Highlights</h2>
          <InfoPill icon={FaTachometerAlt} title="Engine" value={engine_specs} className="text-red-400" />
          <InfoPill icon={FaCogs} title="Transmission" value={transmission} className="text-indigo-400" />
          <InfoPill icon={FaGasPump} title="Fuel Type" value={fuel_type} className="text-orange-400" />
          <InfoPill icon={FaTag} title="Category" value={category} className="text-purple-400" />
          <InfoPill icon={FaGlobe} title="Country" value={country} className="text-blue-400" />
          <div className="flex items-center p-3 bg-gray-800 rounded-lg shadow-sm">
            <FaStar className="w-5 h-5 mr-3 text-yellow-400" />
            <div>
              <span className="block text-sm font-medium text-gray-400">Rating</span>
              {renderRating(rating)}
            </div>
          </div>
        </div>
      </div>

      {/* --- Gallery Images --- */}
      {gallery_images?.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-2xl font-bold text-gray-100">Gallery Views</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
            {/* Include main_image in gallery view for selection */}
            {[main_image, ...gallery_images].map((img, index) => {
              const isActive = img === currentMainImage;
              return (
                <div
                  key={index}
                  onClick={() => handleGalleryClick(img)}
                  className="cursor-pointer"
                >
                  <Zoom>
                    <img
                      src={img}
                      alt={`${model_name}-view-${index}`}
                      className={`object-cover w-full h-32 transition-all duration-300 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.03] ${
                        isActive
                          ? "border-4 border-blue-500 shadow-blue-500/50"
                          : "border-2 border-gray-700"
                      }`}
                    />
                  </Zoom>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Horizontal Rule --- */}
      <hr className="my-12 border-gray-700" />

      {/* ---------- Place a Bid Form ---------- */}
      <div className="p-8 mb-12 bg-gray-800 border border-gray-700 shadow-xl rounded-xl">
        <h2 className="pb-3 mb-6 text-3xl font-bold text-blue-400 border-b border-gray-700">
          Place a Bid 💰
        </h2>
        <form onSubmit={handlePlaceBid} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Input 1: Price */}
            <InputField 
                label="Your Bid Price" 
                name="price" 
                type="number" 
                icon={FaDollarSign} 
                placeholder={`Minimum price: ${price_range?.min_price?.toLocaleString()}`}
            />
            
            {/* Input 2: Email (Pre-filled and Read-Only) */}
            <InputField 
                label="Your Email" 
                name="email" 
                type="email" 
                value={user?.email || ''} 
                readOnly={true} 
                icon={FaAt}
            />
            
            {/* Input 3: Deadline */}
            <InputField 
                label="Dateline" 
                name="dateline" 
                type="date" 
                icon={FaCalendarAlt} 
            />
            
            {/* Empty space or another field if needed */}
            <div></div> 
          </div>

          {/* Input 4: Comments (TextArea) */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="comments" className="flex items-center text-sm font-medium text-gray-400">
              <FaCommentDots className="w-4 h-4 mr-2 text-blue-400" />
              Comments (Optional)
            </label>
            <textarea
              id="comments"
              name="comments"
              rows="4"
              placeholder="Any additional comments for your bid..."
              className="w-full p-3 text-gray-100 transition-colors duration-200 bg-gray-700 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 text-lg font-bold text-white uppercase transition duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-500"
            // You can add a disabled attribute based on availability_status or user login status here
          >
            Place Bid
          </button>
        </form>
      </div>

      {/* --- Horizontal Rule --- */}
      <hr className="my-12 border-gray-700" />

      {/* ---------- Description and Features ---------- */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Description */}
        <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg md:col-span-2 rounded-xl">
          <h3 className="pb-2 mb-4 text-3xl font-bold text-gray-100 border-b border-gray-700">
            Description
          </h3>
          <p className="text-lg leading-relaxed text-gray-300">{description}</p>
        </div>

        {/* Features */}
        <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
          <h3 className="pb-2 mb-4 text-3xl font-bold text-gray-100 border-b border-gray-700">
            Key Features
          </h3>
          <ul className="pl-5 space-y-3 text-gray-300">
            {features?.map((feature, i) => (
              <li key={i} className="flex items-start">
                <FaCheckCircle className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-400" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;