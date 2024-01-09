import React, { FormEvent, useState } from "react";

import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { checkPayment } from "../../../effects/stripe";

import styles from "./styles.module.css";

export default function PaymentForm({
  onClose,
  successCallback,
  noPaymentSelector,
}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setIsLoading(true);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://google.com",
        },
        redirect: "if_required",
      });

      if (error) {
        console.error(error);
        setError(error.message || "");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        const status = await checkPayment(paymentIntent.id);
        if (status) {
          setError("");
          successCallback(paymentIntent);
        }
      } else {
        onClose();
        console.error("payment failed");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={noPaymentSelector ? styles.title : styles.titleFixed}>
        {"payment method"}
      </h1>
      <PaymentElement id="payment-element" />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.footer}>
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className={styles.payButton}>
          {isLoading ? "processing" : "pay"}
        </button>
        <button onClick={onClose} className={styles.cancelButton}>
          {"cancel"}
        </button>
      </div>
    </form>
  );
}
