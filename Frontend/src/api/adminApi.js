import axios from "./axios";

export const fetchPhones = async (page = 1, limit = 10, search = "") => {
  const res = await axios.get("/admin/phones", {
    params: { page, limit, search },
  });
  return res.data;
};


export const fetchUsers = async (page = 1, limit = 10, search = "", sortField = "firstname", sortOrder = "asc") => {
  const response = await axios.get("/admin/users", {
    params: { page, limit, search, sortField, sortOrder },
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

export const fetchModeratedReviews = async ({ searchTitle, searchReviewer, searchComment, page = 1, limit = 10 }) => {
  const res = await axios.get('/admin/reviews', {
    params: {
      searchTitle: searchTitle,
      searchReviewer: searchReviewer,
      searchComment: searchComment,
      page,
      limit,
    },
  });
  return res.data;
};

export const toggleReviewHidden = async (phoneId, reviewerId) => {
  const res = await axios.patch(`/admin/phones/${phoneId}/reviews/${reviewerId}/toggle-hidden`);
  return res.data;
};



export const updatePhone = async (id, updates) => {
  const res = await axios.put(`/admin/phones/${id}`, updates);
  return res.data;
};

export const togglePhoneDisable = async (id) => {
  const res = await axios.put(`/admin/phones/${id}/toggle-disable`);
  return res.data;
};

export const deletePhone = async (id) => {
  const res = await axios.delete(`/admin/phones/${id}`);
  return res.data;
};

