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
