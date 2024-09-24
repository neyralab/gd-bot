import axios from 'axios';
import { getToken } from './set-token';

const instance = axios.create();

instance.interceptors.request.use(
  async function (config) {
    const token = await getToken();
    config.headers['X-Token'] = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
