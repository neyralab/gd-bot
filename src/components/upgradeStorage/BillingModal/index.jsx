import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import Modal from "react-modal";

import { getStripe } from "../../../effects/stripe";

import CheckoutForm from "./CheckoutForm";
import GhostLoader from "../../ghostLoader";

import { ReactComponent as DarkLogo } from "../assets/darkLogo.svg";
import { ReactComponent as CloseIcon } from "../assets/close.svg";

import styles from "./styles.module.css";

const BillingModal = ({
  isOpen,
  onClose,
  clientSecret,
  successCallback,
  noPaymentSelector = false,
}) => {
  const [stripePromise, setStripePromise] = useState(null);
  const appearance = {
    theme: "flat",
    variables: {
      colorText: `#ffffff`,
      colorTextSecondary: "#b9b9b9",
      spacing1: "10px",
      fontFamily: '"IBM Plex Mono", sans-serif',
      fontLineHeight: "1.5",
      borderRadius: "0",
      colorBackground: "#fff",
      focusBoxShadow: "none",
      focusOutline: `1px solid #303030`,
      colorIconTabSelected: "#ffffff",
      colorPrimary: "red",
      inputDividerBackgroundColor: "#303030",
      spacingGridRow: "24px",
    },
    rules: {
      ".Input, .CheckboxInput, .CodeInput": {
        padding: "14px 16px",
        paddingTop: "Input",
        backgroundColor: "#242424",
        transition: "none",
        border: `1px solid #303030`,
      },
      ".Label": {
        fontFamily: '"IBM Plex Mono", sans-serif',
        lineHeight: "21px",
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "8px",
      },
      ".Input": {
        padding: "14px 16px",
      },
      ".Input--invalid": {
        color: "#DF1B41",
      },
      ".Tab, .Block, .PickerItem--selected": {
        backgroundColor: "#242424",
        borderColor: "none",
        boxShadow: "none",
      },
      ".Tab": {
        display: "none",
        transition: "none",
      },
      ".Tab:hover": {
        backgroundColor: "#eee",
      },
      ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
        color: "#ffffff",
        backgroundColor: "",
      },
      ".Tab:focus, .Tab--selected:focus": {
        boxShadow:
          "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        outline: "none",
      },
      ".Tab:focus-visible": {
        outline: "var(--focusOutline)",
      },
    },
  };

  useEffect(() => {
    const initiate = async () => {
      const stripe = await getStripe();
      setStripePromise(stripe);
    };

    if (isOpen) {
      initiate();
    }
  }, [isOpen]);

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}>
      <header className={styles.header}>
        <DarkLogo className={styles.logo} />
        <button className={styles.close} onClick={onClose}>
          <CloseIcon />
        </button>
      </header>
      <div className={styles.paymenForm}>
        {stripePromise && clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              noPaymentSelector={!!noPaymentSelector}
              onClose={onClose}
              successCallback={successCallback}
            />
          </Elements>
        ) : (
          <div className={styles.loader}>
            <GhostLoader texts={["Please wait"]} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BillingModal;
