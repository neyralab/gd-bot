import React from 'react';

export default function ProgressBar({ percent }) {
  const width = percent / 100 * 180;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 202 34" fill="none">
      {/* Base */}
      <rect x="10" y="11.8789" width="181" height="12" rx="2" fill="#252529" />

      {/* Active line */}
      <g filter="url(#filter0_d_5045_42284)">
        <rect
          x="11"
          y="11.1211"
          width={width}
          height="12"
          rx="2"
          fill="url(#paint0_linear_5045_42284)"
          style={{transition: 'width 0.2s'}}
        />
      </g>

      <defs>
        <filter
          id="filter0_d_5045_42284"
          x="0.7"
          y="0.821094"
          width="200.6"
          height="32.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5.15" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.137255 0 0 0 0 0.47451 0 0 0 0 0.976471 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5045_42284"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_5045_42284"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_5045_42284"
          x1="11"
          y1="17.1211"
          x2="191"
          y2="17.1211"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FACFE" />
          <stop offset="1" stopColor="#00F2FE" />
        </linearGradient>
      </defs>
    </svg>
  );
}
