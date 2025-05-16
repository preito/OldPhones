import axios from "./axios";

export const getMyPhones = () => axios.get("/phones/my-listings");
export const createPhone = (payload) =>
  axios.post("/phones/create-phone", payload);
export const deletePhone = (id) => axios.delete(`/phones/${id}`);

export const phoneEnableDisable = (id, payload) =>
  axios.put(`/phones/${id}`, payload);
