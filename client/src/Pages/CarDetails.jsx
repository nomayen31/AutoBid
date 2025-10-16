import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { gsap } from "gsap";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMainImage, setCurrentMainImage] = useState("");
  const formRef = useRef(null);

  // ✅ Fetch car securely with token
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axiosSecure.get(`/car/${id}`);
        setCar(data);
        setCurrentMainImage(data.main_image);
      } catch (error) {
        console.error("Failed to load car:", error);
        toast.error("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, axiosSecure]);

  // ✅ Entry animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 30,
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Loading car details...
      </div>
    );

  if (!car)
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-gray-700">
        Car not found 😔
      </div>
    );

  const {
    brand_name,
    country,
    model_name,
    description,
    category,
    price_range,
    engine_specs,
    transmission,
    fuel_type,
    rating,
    main_image,
    gallery_images = [],
    features = [],
    availability_status,
    dateline,
    _id,
    buyer,
  } = car;

  const isAvailable = availability_status === "Available";
  const handleGalleryClick = (url) => setCurrentMainImage(url);

  // ✅ Secure Bid Submission
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to place a bid.");
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
      brand_name,
      bid_price: price,
      dateline: form.dateline.value,
      comments: form.comments.value,
      status: "Pending",
      seller_email: buyer?.email,
      bidder_email: user?.email,
    };

    try {
      const { data } = await axiosSecure.post("/bid", bidData);
      if (data.insertedId || data.acknowledged) {
        toast.success("Bid placed successfully!");
        navigate("/my-bids");
      } else toast.error("Something went wrong. Try again!");
    } catch (err) {
      console.error("Bid submission error:", err);
      toast.error("Failed to place bid!");
    }
  };

  const InfoPill = ({ icon: Icon, title, value, className = "" }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm"
    >
      <Icon className={`w-5 h-5 mr-3 ${className}`} />
      <div>
        <span className="block text-sm font-medium text-gray-500">
          {title}
        </span>
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

        <motion.div whileHover={{ scale: 1.05 }} className="mt-6 md:mt-0">
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

      {/* Images & Specs */}
      <div className="grid gap-10 mb-14 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Zoom>
            <motion.img
              src={currentMainImage}
              alt={model_name}
              className="w-full shadow-lg img-pop rounded-xl"
              whileHover={{ scale: 1.02 }}
            />
          </Zoom>
          {gallery_images.length > 0 && (
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

          {/* ✅ Full Description Section */}
          <div className="p-6 mt-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="mb-2 text-2xl font-bold text-gray-800">
              Description
            </h3>
            <p className="leading-relaxed text-gray-700">{description}</p>
          </div>

          {/* ✅ Features List */}
          {features.length > 0 && (
            <div className="p-6 mt-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-3 text-2xl font-bold text-gray-800">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column info */}
        <div className="space-y-4 fade-up">
          <h2 className="pb-2 text-2xl font-bold text-gray-800 border-b">
            Specifications
          </h2>
          <InfoPill icon={FaTachometerAlt} title="Engine" value={engine_specs} />
          <InfoPill icon={FaCogs} title="Transmission" value={transmission} />
          <InfoPill icon={FaGasPump} title="Fuel" value={fuel_type} />
          <InfoPill icon={FaTag} title="Category" value={category} />
          <InfoPill icon={FaGlobe} title="Country" value={country} />
          <div className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
            <FaStar className="mr-2 text-yellow-500" />
            <span className="font-semibold text-gray-800">
              {rating || "N/A"} / 5
            </span>
          </div>

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

      {/* ✅ Bid Section */}
      <motion.div
        className="p-8 border border-gray-200 shadow-md mb-14 bg-gray-50 rounded-2xl"
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
