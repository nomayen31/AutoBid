import React from 'react';
import { Gavel, HeartHandshake, Car } from 'lucide-react';

/**
 * A reusable card component for displaying individual features.
 * Uses inline styles for dynamic color theming.
 */
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-xl transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl border-t-4 border-b-2" style={{ borderColor: color, transformOrigin: 'center' }}>
    <div className={`p-4 rounded-full mb-4 shadow-lg`} style={{ backgroundColor: `${color}1A` }}>
      {/* Icon with dynamic color */}
      <Icon className="w-8 h-8" style={{ color: color }} />
    </div>
    <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-sm leading-relaxed text-center text-gray-600 md:text-base">{description}</p>
  </div>
);

/**
 * Main Feature component for the Car Auction section.
 */
const Feature = () => {
  const features = [
    {
      icon: Gavel,
      title: "The Thrill of the Bid",
      description: "Customers feel an undeniable **rush and excitement** as they compete for their dream vehicle. The auction format delivers a unique, competitive, and adrenaline-filled buying experience.",
      color: "#F59E0B", // Amber
    },
    {
      icon: HeartHandshake,
      title: "Trust & Transparency",
      description: "We provide comprehensive vehicle history reports, detailed inspection photos, and clear terms, giving buyers **confidence and a sense of security** in their purchase.",
      color: "#10B981", // Emerald
    },
    {
      icon: Car,
      title: "Unmatched Selection",
      description: "From vintage classics to late-model trucks, the vast inventory guarantees variety, ensuring every customer feels they can find the **exact vehicle** they've been searching for.",
      color: "#3B82F6", // Blue
    },
  ];

  return (
    <section className="py-16 font-sans md:py-24 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            The Car Auction Experience: <span className="text-yellow-600">How Our Customers Feel</span>
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-600">
            It's more than just buying a car—it's an **exhilarating, trustworthy, and efficient** way to acquire your next vehicle.
          </p>
        </div>

        {/* Features Grid - Fully responsive layout */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Feature;
