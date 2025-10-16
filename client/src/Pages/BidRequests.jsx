import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const BidRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: bids = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-requests", user?.email],
    enabled: !!user?.email, // wait until email is available
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/my-request/${user.email}`);
      return data || [];
    },
    staleTime: 60000, 
  });

  const handleStatus = async (id, previousStatus, newStatus) => {
    if (previousStatus === newStatus) {
      toast.error("Already in this status!");
      return;
    }

    try {
      const { data } = await axiosSecure.patch(`/bid/${id}`, {
        status: newStatus,
      });

      if (data.modifiedCount > 0 || data.acknowledged) {
        toast.success(`Bid status updated to ${newStatus}`);
        refetch(); 
      } else {
        toast.error("No changes detected!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status!");
    }
  };

  if (isLoading)
    return (
      <div className="mt-10 text-center text-gray-500">Loading requests...</div>
    );

  if (isError)
    return (
      <div className="mt-10 text-center text-red-500">
        Failed to load bid requests: {error.message}
      </div>
    );

  return (
    <section className="container px-4 pt-12 mx-auto">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium text-gray-800">Bid Requests</h2>
        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
          {bids.length} Requests
        </span>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Model Name
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Buyer Email
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Deadline
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Price
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Brand Name
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Status
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {bids.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-6 text-sm text-center text-gray-500"
                      >
                        No requests found
                      </td>
                    </tr>
                  ) : (
                    bids.map((bid) => (
                      <tr key={bid._id || bid.carId}>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {bid.model_name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {bid.bidder_email || "N/A"}
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
                                  : bid.status === "Rejected"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                              }`}
                            ></span>
                            <h2 className="text-sm font-normal">
                              {bid.status}
                            </h2>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                              onClick={() =>
                                handleStatus(bid._id, bid.status, "Approved")
                              }
                              className="text-gray-500 transition-colors duration-200 hover:text-green-500 focus:outline-none"
                              title="Approve Request"
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
                                  d="m4.5 12.75 6 6 9-13.5"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() =>
                                handleStatus(bid._id, bid.status, "Rejected")
                              }
                              className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                              title="Reject Request"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BidRequests;
