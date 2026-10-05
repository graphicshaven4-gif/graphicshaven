// Dynamic API configuration:
// - In local development: defaults to 'http://localhost:5000'
// - On Vercel (same-domain): defaults to relative '' (/api/...)
// - On Custom Backend (e.g. Render/Railway): uses VITE_API_URL environment variable
export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? (import.meta.env.VITE_API_URL as string)
    : import.meta.env.PROD
    ? ''
    : 'http://localhost:5000';
