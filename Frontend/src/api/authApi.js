import axios from "./axios";

export const login = (email, password) =>
  axios.post("/auth/login", { email, password });
export const logout = () => axios.post("/auth/logout");
export const me = () => axios.get("/auth/me");

export const register = (payload) => axios.post("/auth/register", payload);

export const verifyEmail = ({ token, email }) =>
  axios.get("/auth/verify-email", { params: { token, email } });

export const forgotPassword = ({ email }) =>
  axios.post("/auth/forgot-password", { email });

export const resetPassword = ({ token, email, newPassword }) =>
  axios.post("/auth/reset-password", { token, email, newPassword });

export const updateProfile = payload =>
  axios.put('/auth/update-profile', payload)