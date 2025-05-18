import axios from './axios';

export const checkUserByCredentials = (email, password) => {
  return axios.post('/user/check-credentials', { email, password });
};

export const saveTransaction = (userId, items, total) => {
  return axios.post('/user/save-transaction', {
    userId,
    items,
    total
  });
};
