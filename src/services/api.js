import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api-chamados.jefersonqueiroga.com.br",
  headers: { "X-API-Key": import.meta.env.VITE_API_KEY },
});

export default api;