import axios from "axios";

// For API routes with `/api` prefix
export const authApi = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// For login/logout routes without `/api` prefix
export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
