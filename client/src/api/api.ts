import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// Add this interceptor if needed
api.interceptors.request.use(config => {
  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default api;