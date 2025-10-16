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
      (response) => response, 
      async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          await logout(); 
          navigate("/login"); 
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
