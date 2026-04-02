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

        // 2. Inject farmId as header and as query param for GET requests.
        const rawFarmId = state?.selectedFarm?.id;
        if (rawFarmId) {
          const cleanFarmId = typeof rawFarmId === "string" ? rawFarmId.split(":")[0] : rawFarmId;

          config.headers["X-Farm-Id"] = cleanFarmId;

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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401: Unauthorized.
      // Check if the token is truly missing or expired.
      try {
        const parsed = JSON.parse(localStorage.getItem("auth-storage") || "{}");
        const token = parsed?.state?.token;

        if (!token) {
          // No token at all: clear and redirect.
          localStorage.removeItem("auth-storage");
          window.dispatchEvent(new Event("auth-change"));
        } else {
          // Token exists: Could be a context issue (Farm ID) or a backend config issue (IP Whitelist).
          // We don't force logout here to avoid bad UX if it's a server-side config problem.
          console.error("[Feeding-MF] 401 Unauthorized - Token exists but request rejected. Check Gateway/Service configuration.", {
            url: error.config.url,
            farmId: error.config.headers["X-Farm-Id"]
          });
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
