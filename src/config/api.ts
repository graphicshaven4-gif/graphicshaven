// Dynamic API configuration:
// - If VITE_API_URL is set: uses external backend URL (e.g. Render, Railway, separate domain)
// - If in production without VITE_API_URL: defaults to relative '' (/api/...) for same-domain
// - In local development: defaults to 'http://localhost:5000'
const rawUrl =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? (import.meta.env.VITE_API_URL as string)
    : import.meta.env.PROD
    ? ''
    : 'http://localhost:5000';

// Strip any trailing slash so URLs are always cleanly formed
export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
