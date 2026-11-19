// Dynamic API configuration:
// - If VITE_API_URL is set: uses external backend URL
// - Otherwise: defaults to 'https://graphicshaven-backend.vercel.app'
const rawUrl =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? (import.meta.env.VITE_API_URL as string)
    : 'https://graphicshaven-backend.vercel.app';

// Strip any trailing slash so URLs are always cleanly formed
export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
