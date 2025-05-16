import axios from "./axios";

export const fetchPhones = async (page = 1, limit = 10) => {
  const res = await axios.get(`/admin/phones/phones?page=${page}&limit=${limit}`);
  return res.data;
};
export const fetchUsers = async (page = 1, limit = 10, search = "") => {
  const response = await axios.get("/admin/users", {
    params: { page, limit, search },
  });
  return response.data;
};
export const updateUser = async (id, updates) => {
  const res = await axios.put(`/admin/users/${id}`, updates);
  return res.data;
};
export const deleteUser = async (id) => {
  const response = await axios.delete(`/admin/users/${id}`);
  return response.data;
};
export const toggleUserDisable = async (userId) => {
  const response = await axios.patch(`/admin/users/${userId}/toggle-disable`);
  return response.data;
};

