import axios from 'axios';
import { showToast } from 'vant';
import { getToken } from '@/utils/storage';

export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? '请求失败';
    showToast(Array.isArray(message) ? message[0] : message);
    return Promise.reject(error);
  },
);

