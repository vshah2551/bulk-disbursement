import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081"
});

apiClient.interceptors.request.use(
  (config) => {

    const isAuthRequest =
      config.url === "/api/auth/login" ||
      config.url === "/api/auth/register";

    if (!isAuthRequest) {

      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;