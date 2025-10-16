import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaGithub,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Contact AutoBid
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          AutoBid is your one-stop platform for transparent, real-time car
          bidding. Our mission is to make buying and selling cars easier,
          faster, and more secure — powered by data, design, and trust.
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Get in Touch
          </h2>
          <p className="text-gray-600">
            Have questions or need assistance? Reach out to our team — we’d love
            to help.
          </p>

          <div className="space-y-3 mt-4 text-gray-700">
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" /> support@autobid.com
            </p>
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-600" /> +880 1234-567890
            </p>
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" /> Dhaka, Bangladesh
            </p>
            <p className="flex items-center gap-3">
              <FaGlobe className="text-blue-600" />
              <a
                href="https://lnk.bio/nomayen31"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Our Profile
              </a>
            </p>
          </div>
        </div>

        {/* Right Column — Contact Form */}
        <form className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Send a Message
          </h2>

          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Developer Profile Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 mt-16 max-w-3xl w-full text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image */}
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocL3WJ-8ZTqb6xAslv3e04cRlftwx-o5xJRuqnP1bWEivvqLSAw-aA=s96-c"
            alt="Nomayen Hossain"
            className="w-24 h-24 rounded-full shadow-md border-4 border-blue-100 object-cover mb-3"
          />

          <h2 className="text-2xl font-semibold text-gray-800">
            Developer Profile
          </h2>
          <p className="text-gray-600">
            Designed & Developed by{" "}
            <span className="font-semibold text-gray-800">
              Nomayen Hossain
            </span>
          </p>
          <p className="text-gray-500">Dhaka, Bangladesh</p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-4 text-xl">
            <a
              href="https://github.com/nomayen31"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-gray-900 transition"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.facebook.com/nomayenhossainohin"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-blue-600 transition"
              title="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.linkedin.com/in/nomayen-hossain"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-blue-700 transition"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://instagram.com/nomayen._.31"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-pink-500 transition"
              title="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://lnk.bio/nomayen31"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-green-600 transition"
              title="Link.bio"
            >
              <FaGlobe />
            </a>
          </div>

          {/* Calendly Button */}
          <a
            href="https://calendly.com/nomayen-ohin/30min"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
          >
            📅 Book a Meeting
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} AutoBid — All rights reserved.
      </div>
    </div>
  );
};

export default Contact;
