import React from 'react';

export default function BackgroundSvg({ active }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="86"
      height="106"
      viewBox="0 0 86 106"
      fill="none">
      <path
        d="M14.4271 104.735C12.3669 105.575 10.0118 104.574 9.25021 102.484C-2.06645 71.4226 -2.8453 36.4364 9.26847 3.28714C10.0371 1.18378 12.417 0.187268 14.4819 1.05404L82.5387 29.6224C84.5024 30.4467 85.462 32.6626 84.8607 34.7057C81.2145 47.0946 81.5836 59.9029 85.3313 71.5721C86.0001 73.6546 85.0267 75.9509 83.0012 76.7767L14.4271 104.735Z"
        fill={active ? '#007DE9' : '#4C4D4F'}
        style={{transition: 'fill 0.2s'}}
      />
    </svg>
  );
}
