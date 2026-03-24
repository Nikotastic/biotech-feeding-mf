import axios from "axios";

// Get API URL from environment or use mock mode
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
const API_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  "https://api-gateway-bio-tech.up.railway.app/api";

// API client configured for the Gateway
const apiClient = axios.create({
  baseURL: USE_MOCK_API ? "http://localhost:9999/mock-api" : API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token in each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage");
    console.log("🛠️ [Feeding-MF] Request config:", config.url);
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData?.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
        const selectedFarm = authData?.state?.selectedFarm;
        if (selectedFarm && selectedFarm.id) {
          if (!config.headers["X-Farm-Id"]) {
            config.headers["X-Farm-Id"] = selectedFarm.id;
          }
          if (config.method === "get") {
            const urlHasFarmId = config.url && config.url.includes("farmId=");
            const paramsHasFarmId = config.params && config.params.farmId !== undefined;
            if (!urlHasFarmId && !paramsHasFarmId) {
              config.params = { ...config.params, farmId: selectedFarm.id };
            }
          }
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear session if there is genuinely no token.
      // Resource-level 401s (farm context issues) must NOT log the user out.
      try {
        const parsed = JSON.parse(localStorage.getItem("auth-storage") || "{}");
        if (!parsed?.state?.token) {
          localStorage.removeItem("auth-storage");
          window.dispatchEvent(new Event("auth-change"));
        }
      } catch {
        localStorage.removeItem("auth-storage");
        window.dispatchEvent(new Event("auth-change"));
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
