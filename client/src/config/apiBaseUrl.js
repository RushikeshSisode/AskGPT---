const rawBaseUrl = import.meta.env.VITE_BACKEND_URL?.trim() || "";

if (!rawBaseUrl && import.meta.env.PROD) {
  console.warn("VITE_BACKEND_URL is not set. API requests will use the current origin.");
}

const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export default API_BASE_URL;
