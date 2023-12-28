import { loadStripe } from "@stripe/stripe-js/pure";
import axiosInstance from "./axiosInstance";

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLICK_KEY);
  }
  return stripePromise;
};

export const createStripeSorageSub = async (priceId, quantity = 1) => {
  try {
    const { data } = await axiosInstance.post(
      `${process.env.REACT_APP_API_PATH}/workspace/storage/create/subscription`,
      [{ price: priceId, quantity }]
    );

    return { ...data, priceId };
  } catch (error) {
    console.error(error);
  }
};
