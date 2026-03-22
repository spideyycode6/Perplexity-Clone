/**
 * Base URL for REST API and Socket.IO (same backend).
 * Set VITE_API_BASE_URL when the UI is not served from the API host (e.g. `vite preview`, CDN + separate API).
 */
export function getApiBaseURL() {
    const fromEnv = import.meta.env.VITE_API_BASE_URL;
    if (fromEnv != null && String(fromEnv).trim() !== "") {
        return String(fromEnv).replace(/\/$/, "");
    }
    if (import.meta.env.DEV) {
        return "http://localhost:3000";
    }
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "";
}
