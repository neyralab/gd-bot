// Refactoring №3
import React from "react";

const CustomWrapper = ({ className, color }) => (
  <svg
    className={className}
    width="63"
    height="82"
    viewBox="0 0 63 82"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 2C1 1.44772 1.44772 1 2 1H48.6592C48.9282 1 49.1859 1.10839 49.374 1.30069L61.7148 13.9151C61.8976 14.102 62 14.353 62 14.6144V76C62 76.5523 61.5523 77 61 77H31.5H2C1.44772 77 1 76.5523 1 76V2Z"
      fill="#1C1C1E"
      stroke="#FFFFFF"
      strokeWidth="0.3"
    />
    <path
      d="M5 79H58V80C58 80.5523 57.5523 81 57 81H6C5.44771 81 5 80.5523 5 80V79Z"
      fill="#1C1C1E"
      stroke="#FFFFFF"
      strokeWidth="0.3"
    />
    <path
      d="M3 77H61V78C61 78.5523 60.5523 79 60 79H4C3.44771 79 3 78.5523 3 78V77Z"
      fill="#1C1C1E"
      stroke="#FFFFFF"
      strokeWidth="0.3"
    />
    <path
      d="M51.6182 1.40607C51.5237 1.31157 51.5906 1.15 51.7243 1.15H61.7C61.7828 1.15 61.85 1.21716 61.85 1.3V11.2757C61.85 11.4094 61.6884 11.4763 61.5939 11.3818L61.4879 11.4879L61.5939 11.3818L51.6182 1.40607Z"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="0.3"
    />
  </svg>
);

CustomWrapper.defaultProps = {
  color: "#1C1C1E",
};

export default CustomWrapper;
