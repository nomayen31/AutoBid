import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Slide = ({ image, text }) => {
  // Refs for text elements
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate text elements sequentially
    tl.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        paragraphRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
  }, [text]);

  return (
    <div className="relative w-full h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <img
        src={image}
        alt="Auction Slide"
        className="w-full h-full object-cover brightness-[0.65] transition-all duration-700 hover:brightness-75"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2
          ref={titleRef}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-yellow-400 drop-shadow-lg leading-tight mb-4 opacity-0"
        >
          {text}
        </h2>
        <p
          ref={paragraphRef}
          className="text-gray-300 text-base md:text-lg max-w-2xl opacity-0"
        >
          Explore exclusive car deals and bid confidently — only on our live auction platform.
        </p>
        <button
          ref={buttonRef}
          className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 opacity-0"
        >
          Join Auction Now
        </button>
      </div>
    </div>
  );
};

export default Slide;
