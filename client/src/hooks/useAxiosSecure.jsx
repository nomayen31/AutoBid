import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";

// Create axios instance
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Add a response interceptor
    const interceptor = axiosSecure.interceptors.response.use(
      (response) => response, // ✅ If response is successful, just return it
      async (error) => {
        const status = error?.response?.status;

        // ❌ Unauthorized or Forbidden
        if (status === 401 || status === 403) {
          await logout(); // call logout from your AuthProvider
          navigate("/login"); // redirect to login page
        }

        // Always reject the error so the caller can still catch it
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
