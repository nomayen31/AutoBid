import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const MyBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);

  // Fetch bids placed by this user
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

  // ✅ Handle status change (Mark Complete)
  const handleStatus = async (id, previousStatus, newStatus) => {
    if (previousStatus === newStatus) {
      toast.error("Already marked as completed!");
      return;
    }

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/bid/${id}`,
        { status: newStatus }
      );

      if (data.modifiedCount > 0 || data.acknowledged) {
        // Update UI immediately
        setBids((prev) =>
          prev.map((bid) =>
            bid._id === id ? { ...bid, status: newStatus } : bid
          )
        );
        toast.success(`Bid marked as ${newStatus}`);
      } else {
        toast.error("No changes detected!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update bid status!");
    }
  };

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
                <tr key={bid._id || bid.carId}>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {bid.model_name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {bid.dateline}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    ${bid.bid_price}
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

                  {/* Status Badge */}
                  <td className="px-4 py-4 text-sm font-medium text-gray-700">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                        bid.status === "Pending"
                          ? "text-yellow-500 bg-yellow-100"
                          : bid.status === "Approved"
                          ? "text-green-600 bg-green-100"
                          : bid.status === "Completed"
                          ? "text-blue-600 bg-blue-100"
                          : bid.status === "Rejected"
                          ? "text-red-600 bg-red-100"
                          : "text-gray-500 bg-gray-100"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          bid.status === "Pending"
                            ? "bg-yellow-500"
                            : bid.status === "Approved"
                            ? "bg-green-500"
                            : bid.status === "Completed"
                            ? "bg-blue-500"
                            : bid.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      <h2 className="text-sm font-normal">{bid.status}</h2>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <button
                      title="Mark Complete"
                      onClick={() =>
                        handleStatus(bid._id, bid.status, "Completed")
                      }
                      disabled={bid.status === "Completed"}
                      className={`transition-colors duration-200 focus:outline-none ${
                        bid.status === "Completed"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
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
