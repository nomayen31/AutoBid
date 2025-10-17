import React from "react";

const About = () => {
  return (
    <section className="px-6 py-16 bg-gray-50 md:px-20 lg:px-32">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">
          About <span className="text-blue-600">AutoBids</span>
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-gray-600">
          Welcome to <strong>AutoBids</strong> — your trusted destination for
          buying and selling cars through transparent, exciting, and competitive
          auctions. We combine innovation and trust to create a smooth
          experience for both car enthusiasts and dealers.
        </p>

        <div className="grid gap-10 mt-12 text-left md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-2xl font-semibold text-gray-800">
              Who We Are
            </h2>
            <p className="leading-relaxed text-gray-600">
              AutoBids is a next-generation online car auction platform that
              connects buyers and sellers across the globe. Our mission is to
              make car trading simple, secure, and efficient through live
              auctions powered by modern technology.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-gray-800">
              What We Do
            </h2>
            <p className="leading-relaxed text-gray-600">
              Whether you're looking for your dream car or aiming to sell your
              vehicle at the best possible price, AutoBids gives you the tools
              and confidence to make it happen. Our real-time auction system,
              verified sellers, and transparent bidding ensure every deal is
              fair and exciting.
            </p>
          </div>
        </div>

        <div className="p-8 mt-12 bg-white shadow-md rounded-2xl">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">
            Our Vision
          </h2>
          <p className="leading-relaxed text-gray-600">
            To redefine the automotive marketplace by creating a trusted
            ecosystem where technology meets transparency — empowering everyone
            to bid, buy, and sell vehicles with complete confidence.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800">
            Why Choose AutoBids?
          </h2>
          <ul className="max-w-3xl mx-auto space-y-2 text-left text-gray-600 list-disc list-inside">
            <li>Real-time live auctions with secure payments</li>
            <li>Verified car listings with detailed information</li>
            <li>Fair pricing and transparent bidding process</li>
            <li>Dedicated customer support team</li>
            <li>Seamless mobile and desktop experience</li>
          </ul>
        </div>

        <div className="mt-16">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AutoBids. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
