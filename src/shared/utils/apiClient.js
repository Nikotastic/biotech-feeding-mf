import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  "https://api.biotech.159.54.176.254.nip.io/api";

// API client configured for the Gateway
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: inject JWT token and farmId query param for GET requests.
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const state = parsed.state;

        // 1. Inject JWT Token
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }

        // 2. Inject farmId as query param for GET requests.
        const rawFarmId = state?.selectedFarm?.id;
        if (rawFarmId) {
          const cleanFarmId = typeof rawFarmId === "string" ? rawFarmId.split(":")[0] : rawFarmId;

          if (config.method === "get") {
            config.params = {
              ...config.params,
              farmId: cleanFarmId,
            };
          }
        }
      } catch (error) {
        console.error("[Feeding-MF] Error parsing auth storage:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor: handle 401 errors.
// Only clear the session if there is genuinely NO token in storage.
// Resource-level 401s (e.g. missing farm context) must NOT log the user out.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        const parsed = JSON.parse(
          localStorage.getItem("auth-storage") || "{}",
        );
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
