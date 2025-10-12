import { Link } from "react-router-dom";

const JobCard = ({ car }) => {
  // Extract the model details
  const {
    model_name,
    description,
    category,
    price_range,
    main_image,
    rating,
    _id,
  } = car || {};

  return (
    <div className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all">
      {/* Car Image */}
      <img
        src={main_image}
        alt={model_name}
        className="object-cover w-full h-48 rounded-md"
      />

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 text-[10px] text-blue-800 uppercase bg-blue-200 rounded-full">
            {category}
          </span>
          <span className="text-xs font-semibold text-yellow-500">
            ⭐ {rating ?? "N/A"}
          </span>
        </div>

        <h1 className="mt-2 text-lg font-semibold text-gray-800">
          {model_name}
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          {description?.substring(0, 70) ?? ""}...
        </p>

        <p className="mt-2 text-sm font-bold text-gray-700">
          ${price_range?.min_price?.toLocaleString()} - $
          {price_range?.max_price?.toLocaleString()}
        </p>

        {/* View Details Button */}
        <Link
          to={`/car/${_id}`}
          className="inline-block px-4 py-2 mt-3 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
