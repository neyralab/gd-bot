import axios from "axios";

export const authorizeUser = async (reqBody) => {
  const apiUrl = process.env.REACT_APP_AUTHORIZATION;

  const res = await axios
    .post(apiUrl, reqBody)
    .then((response) => response.data)
    .catch((error) => {
      alert(error.message);
      return error.message;
    });

  return res;
};
