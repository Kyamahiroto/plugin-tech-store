// Centralized API URL helper.
// In development: uses localhost:3001
// In production (Vercel): uses relative path '' (same origin, no hardcoded domain needed)
export const API_URL = import.meta.env.VITE_API_URL ?? '';
