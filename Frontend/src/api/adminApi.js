import axios from "./axios";

export const fetchPhones = async (page = 1, limit = 10) => {
  const res = await axios.get(`/admin/phones/phones?page=${page}&limit=${limit}`);
  return res.data;
};
export const fetchUsers = async (page = 1, limit = 10) => {
  const res = await axios.get(`/admin/users?page=${page}&limit=${limit}`);
  console.log(res.data);
  return res.data;
};