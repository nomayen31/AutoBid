import axios from "axios";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    // Request interceptor — attach JWT if available
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — handle auth errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response) {
          console.error("Network error:", error.message);
          return Promise.reject(error);
        }

        const status = error.response.status;
        if (status === 401 || status === 403) {
          await logout();
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // Cleanup on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
