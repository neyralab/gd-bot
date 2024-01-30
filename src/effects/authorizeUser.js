import axios from "axios";

export const authorizeUser = async (reqBody) => {
  const apiUrl = process.env.REACT_APP_AUTHORIZATION;

  const res = await axios
    .post(apiUrl, reqBody)
    .then((response) => response.data)
    .catch((error) => error.message);

  return res;
};
