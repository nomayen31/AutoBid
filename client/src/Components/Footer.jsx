import React from "react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="https://img.icons8.com/fluency/96/000000/car.png"
              alt="AutoBid Logo"
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-semibold text-gray-800">AutoBid</h2>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-gray-600 text-sm font-medium">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              About
            </Link>
            <Link
              to="/teams"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Teams
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Contact
            </Link>
            <a
              href="/privacy"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Privacy
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center md:text-left">
            © Copyright {new Date().getFullYear()} <b>AutoBid</b>. All Rights Reserved.
          </p>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-4 text-gray-600 text-lg">
            <a
              href="mailto:support@autobid.com"
              className="hover:text-blue-600 transition"
              title="Email"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://www.facebook.com/nomayenhossainohin"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
              title="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/in/nomayen-hossain"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-700 transition"
              title="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com/nomayen31"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-800 transition"
              title="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://instagram.com/nomayen._.31"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition"
              title="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
