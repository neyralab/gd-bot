import axios from "axios";

const instance = axios.create();

const token = localStorage.getItem("token");

instance.interceptors.request.use(
  function (config) {
    config.headers["X-Token"] = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
