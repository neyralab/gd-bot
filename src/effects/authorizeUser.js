import axios from "axios";
import * as Sentry from "@sentry/react";
import { API_AUTHORIZATION } from "../utils/api-urls";

export const authorizeUser = async (reqBody) => {
  const res = await axios
    .post(API_AUTHORIZATION, reqBody)
    .then((response) => response.data)
    .catch((error) => {
      Sentry.captureMessage(`Error in authorizeUser: ${error.message}`);
      return error.message;
    });

  return res;
};
export const connectUserV8 = async (data) => {
  console.log(data);
  const url =
    "https://ab63-180-254-224-67.ngrok-free.app/api/auth/identity/connect_userv8";
  const body = {
    provider: "telegram",
    initData: data,
  };
  const res = await axios.put(url, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("res", res);
};
