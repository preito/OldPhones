import axios from './axios';

export const checkUserByCredentials = (email, password) => {
  return axios.post('/user/check-credentials', { email, password });
};
