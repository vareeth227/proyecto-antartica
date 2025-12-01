const API_URL = import.meta.env.VITE_API_URL;

export default {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  books: `${API_URL}/books`,
  categories: `${API_URL}/categories`,
  cart: `${API_URL}/cart`,
  orders: `${API_URL}/orders`,
  users: `${API_URL}/users`,
};
