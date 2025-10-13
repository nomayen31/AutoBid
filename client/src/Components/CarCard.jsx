import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const JobCard = ({ car }) => {
  const {
    model_name,
    description,
    category,
    price_range,
    main_image,
    rating,
    _id,
  } = car || {};

  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  // ✨ Entrance Animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, delay: Math.random() * 0.3 }
    );
  }, []);

  // ✨ Hover Animation
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      boxShadow: "0px 8px 25px rgba(250, 204, 21, 0.25)",
      borderColor: "#FACC15",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(imageRef.current, { scale: 1.1, duration: 0.8, ease: "power3.out" });
    gsap.to(buttonRef.current, {
      backgroundColor: "#facc15",
      color: "#000",
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      borderColor: "#E5E7EB",
      duration: 0.4,
      ease: "power2.inOut",
    });
    gsap.to(imageRef.current, { scale: 1, duration: 0.8, ease: "power3.inOut" });
    gsap.to(buttonRef.current, {
      backgroundColor: "#EAB308",
      color: "#fff",
      duration: 0.3,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-xl overflow-hidden transform transition-all duration-300"
    >
      {/* --- Glow Accent (top border line) --- */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500"></div>

      {/* --- Car Image --- */}
      <div className="overflow-hidden rounded-t-2xl">
        <img
          ref={imageRef}
          src={
            main_image ||
            "https://via.placeholder.com/400x250?text=Car+Image+Unavailable"
          }
          alt={model_name}
          className="object-cover w-full h-48 rounded-t-2xl transform transition-all duration-700"
        />
      </div>

      {/* --- Content Section --- */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 text-[10px] font-semibold uppercase bg-yellow-200/20 text-yellow-400 rounded-full">
            {category}
          </span>
          <span className="text-xs font-semibold text-yellow-400">
            ⭐ {rating ?? "N/A"}
          </span>
        </div>

        <h2 className="text-xl font-bold text-yellow-300 mb-1 tracking-wide">
          {model_name}
        </h2>

        <p className="text-gray-400 text-sm mb-3 leading-snug">
          {description?.substring(0, 75) ?? ""}...
        </p>

        <p className="text-md font-semibold text-white mb-4">
          {price_range?.min_price && price_range?.max_price
            ? `$${price_range.min_price.toLocaleString()} - $${price_range.max_price.toLocaleString()}`
            : price_range || "Price on Request"}
        </p>

        {/* --- Button --- */}
        <div className="flex justify-center">
          <button
            ref={buttonRef}
            className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-full shadow-md hover:shadow-yellow-400/30 transition-all duration-300"
          >
            <Link to={`/car/${_id}`}>View Details</Link>
          </button>
        </div>
      </div>

      {/* --- Floating Glow Hover Border --- */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent"></div>
    </div>
  );
};

export default JobCard;
