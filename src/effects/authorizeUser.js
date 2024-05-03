import axios from "axios";
import * as Sentry from "@sentry/react";

export const authorizeUser = async (reqBody) => {
  const apiUrl = process.env.REACT_APP_AUTHORIZATION;

  const res = await axios
    .post(apiUrl, reqBody)
    .then((response) => response.data)
    .catch((error) => {
      Sentry.captureMessage(`Error in authorizeUser: ${error.message}`);
      return error.message;
    });

  return res;
};
export const connectUserV8 = async (data) => {
  console.log(data);
  const url = "https://api.neyra.ai/api/auth/identity/connect_userv8";
  const res = await axios.put(
    url,
    {
      provider: "telegram",
      ...data,
      ...data.user,
      auth_date: Number(data.auth_date),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("res", res);
};
