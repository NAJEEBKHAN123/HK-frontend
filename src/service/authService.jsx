import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const verifyAdminToken = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.isValid;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

export const logoutAdmin = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    await axios.post(`${API_BASE_URL}/api/admin/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};