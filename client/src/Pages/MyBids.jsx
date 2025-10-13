import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";

const MyBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  console.log(bids);

  useEffect(() => {
    if (!user?.email) return;

    const getData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/my-bids/${user.email}`
        );
        setBids(data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    getData();
  }, [user]);

  return (
    <section className="container px-6 py-12 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Bids</h2>
        <span className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-full">
          {bids.length.toString().padStart(2, "0")} Bids
        </span>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-600">
                Model Name
              </th>
              <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-600">
                Deadline
              </th>
              <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-600">
                Price
              </th>
              <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-600">
                Brand Name
              </th>
              <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-600">
                Status
              </th>
              <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {bids.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-sm text-center text-gray-500"
                >
                  No bids found
                </td>
              </tr>
            ) : (
              bids.map((bid) => (
                <tr key={bid.carId}>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {bid.model_name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {bid.dateline}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    ${bid.price}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full
      ${
        bid.brand_name === "Toyota"
          ? "bg-red-100 text-red-600"
          : bid.brand_name === "BMW"
          ? "bg-blue-100 text-blue-600"
          : bid.brand_name === "Tesla"
          ? "bg-gray-100 text-gray-700"
          : bid.brand_name === "Mercedes-Benz"
          ? "bg-purple-100 text-purple-600"
          : bid.brand_name === "Ford"
          ? "bg-green-100 text-green-600"
          : bid.brand_name === "Hyundai"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-gray-100 text-gray-500"
      }`}
                    >
                      {bid.brand_name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                        bid.status === "Pending"
                          ? "text-yellow-500 bg-yellow-100"
                          : bid.status === "Approved"
                          ? "text-green-600 bg-green-100"
                          : "text-gray-500 bg-gray-100"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          bid.status === "Pending"
                            ? "bg-yellow-500"
                            : bid.status === "Approved"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      <h2 className="text-sm font-normal">{bid.status}</h2>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <button
                      title="Mark Complete"
                      className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyBids;
