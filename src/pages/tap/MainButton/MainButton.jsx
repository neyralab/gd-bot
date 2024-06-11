import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './MainButton.module.css';

const MainButton = forwardRef(({ theme }, ref) => {
  const iconRef = useRef(null);
  const frame1Ref = useRef(null);
  const frame2Ref = useRef(null);
  const frame3Ref = useRef(null);
  const frame4Ref = useRef(null);
  const frame5Ref = useRef(null);

  // Array to store animation frame IDs for each element
  const animationFrameIds = [];

  const runAnimation = () => {
    // Function to cancel all ongoing animations
    const cancelAllAnimations = () => {
      animationFrameIds.forEach((id) => {
        if (id !== null) {
          cancelAnimationFrame(id);
        }
      });
    };

    // Immediately cancel any ongoing animations
    // cancelAllAnimations();

    const frames = [
      iconRef,
      frame1Ref,
      frame2Ref,
      frame3Ref,
      frame4Ref,
      frame5Ref
    ];

    const scaleCoefs = [0.1, 0.07, 0.06, 0.04, 0.02, 0.01];
    const maxOpacities = [1, 1, 1, 1, 0.5, 0.2];
    const minOpacities = [0.95, 0.9, 0.9, 0.6, 0.2, 0.1];

    const durationUp = 100; // Duration for up phase
    const durationDown = 150; // Duration for down phase
    const totalDuration = durationUp + durationDown;
    const delayBetweenFrames = 50; // Delay between frames

    // Function to get the current scale of an element
    const getCurrentScale = (element) => {
      const transform = window.getComputedStyle(element).transform;
      const match = /scale\(([^)]+)\)/.exec(transform);
      return match ? parseFloat(match[1]) : 1; // Default to 1 if no scale is found
    };
    // Function to get the current opacity of an element
    const getCurrentOpacity = (element) => {
      const opacity = window.getComputedStyle(element).opacity;
      return opacity ? parseFloat(opacity) : 1; // Default to 1 if no opacity is found
    };

    // Start the animation for each element with a delay
    frames.forEach((frameRef, index) => {
      if (frameRef.current) {
        const startScale = getCurrentScale(frameRef.current); // Get the current scale of the element
        const startOpacity = getCurrentOpacity(frameRef.current); // Get the current opacity of the element
        let startTime = null;

        const animateFrame = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const currentTime = timestamp - startTime;
          const timeElapsed = currentTime - index * delayBetweenFrames;
          const scaleCoef = scaleCoefs[index]; // Get the scale coefficient for the current frame

          if (timeElapsed >= 0 && timeElapsed <= totalDuration) {
            let scale;
            let opacity;
            if (timeElapsed <= durationUp) {
              // UP PHASE
              scale = startScale + scaleCoef * (timeElapsed / durationUp);
              opacity =
                startOpacity +
                (maxOpacities[index] - startOpacity) *
                  (timeElapsed / durationUp);
            } else if (timeElapsed <= totalDuration) {
              // DOWN PHASE
              const timeScaleDown = timeElapsed - durationUp;
              scale =
                startScale +
                scaleCoef -
                scaleCoef * (timeScaleDown / durationDown);
              opacity =
                maxOpacities[index] -
                (maxOpacities[index] - minOpacities[index]) *
                  (timeScaleDown / durationDown);
            }
            if (frameRef.current) {
              frameRef.current.style.transform = `scale(${scale})`;
              frameRef.current.style.opacity = opacity.toString();
            }
          }

          if (timeElapsed < totalDuration) {
            animationFrameIds[index] = requestAnimationFrame(animateFrame);
          } else {
            animationFrameIds[index] = null;
          }
        };

        animationFrameIds[index] = requestAnimationFrame(animateFrame);
      }
    });

    // Return a function to cancel all animations
    return cancelAllAnimations;
  };

  useImperativeHandle(ref, () => ({
    runAnimation: runAnimation
  }));

  return (
    <div
      className={classNames(
        styles.container,
        theme === 'gold' ? styles.gold : styles.default
      )}>
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 390 441"
        fill="none">
        {/* Frame 2 */}
        <g ref={frame2Ref}>
          <g
            filter={
              theme === 'gold'
                ? 'url(#filter0_d_5348_37972)'
                : 'url(#filter0_d_5045_42301)'
            }>
            <path
              d="M189.5 83.4641C193.213 81.3205 197.787 81.3205 201.5 83.4641L310.311 146.286C314.023 148.429 316.311 152.391 316.311 156.678V282.322C316.311 286.609 314.023 290.571 310.311 292.714L201.5 355.536C197.787 357.68 193.213 357.68 189.5 355.536L80.6895 292.714C76.9766 290.571 74.6895 286.609 74.6895 282.322V156.678C74.6895 152.391 76.9766 148.429 80.6895 146.286L189.5 83.4641Z"
              fill={theme === 'gold' ? '#000000' : '#161C30'}
            />
            <path
              d="M190.25 84.7631C193.499 82.8875 197.501 82.8875 200.75 84.7631L309.561 147.585C312.809 149.461 314.811 152.927 314.811 156.678V282.322C314.811 286.073 312.809 289.539 309.561 291.415L200.75 354.237C197.501 356.113 193.499 356.113 190.25 354.237L81.4395 291.415C78.1907 289.539 76.1895 286.073 76.1895 282.322V156.678C76.1895 152.927 78.1907 149.461 81.4395 147.585L190.25 84.7631Z"
              stroke="url(#paint0_linear_5045_42301)"
              strokeWidth="3"
            />
          </g>

          <g
            filter={
              theme === 'gold'
                ? 'url(#filter1_d_5348_37972)'
                : 'url(#filter1_d_5045_42301)'
            }>
            <path
              d="M189.5 83.4641C193.213 81.3205 197.787 81.3205 201.5 83.4641L310.311 146.286C314.023 148.429 316.311 152.391 316.311 156.678V282.322C316.311 286.609 314.023 290.571 310.311 292.714L201.5 355.536C197.787 357.68 193.213 357.68 189.5 355.536L80.6895 292.714C76.9766 290.571 74.6895 286.609 74.6895 282.322V156.678C74.6895 152.391 76.9766 148.429 80.6895 146.286L189.5 83.4641Z"
              fill={theme === 'gold' ? '#000000' : '#161C30'}
            />
            <path
              d="M190.25 84.7631C193.499 82.8875 197.501 82.8875 200.75 84.7631L309.561 147.585C312.809 149.461 314.811 152.927 314.811 156.678V282.322C314.811 286.073 312.809 289.539 309.561 291.415L200.75 354.237C197.501 356.113 193.499 356.113 190.25 354.237L81.4395 291.415C78.1907 289.539 76.1895 286.073 76.1895 282.322V156.678C76.1895 152.927 78.1907 149.461 81.4395 147.585L190.25 84.7631Z"
              stroke="url(#paint1_linear_5045_42301)"
              strokeWidth="3"
            />
          </g>
        </g>

        {/* Frame 1 */}
        <g ref={frame1Ref}>
          <path
            d="M192.5 105.66C194.356 104.588 196.644 104.588 198.5 105.66L292.588 159.982C294.445 161.054 295.588 163.035 295.588 165.178V273.822C295.588 275.965 294.445 277.946 292.588 279.018L198.5 333.34C196.644 334.412 194.356 334.412 192.5 333.34L98.4119 279.018C96.5555 277.946 95.4119 275.965 95.4119 273.822V165.178C95.4119 163.035 96.5555 161.054 98.4119 159.982L192.5 105.66Z"
            stroke="#02081C"
            strokeWidth="12"
          />

          <g
            filter={
              theme === 'gold'
                ? 'url(#filter2_d_5348_37972)'
                : 'url(#filter2_d_5045_42301)'
            }>
            <path
              d="M189.75 100.897C193.308 98.8428 197.692 98.8428 201.25 100.897L295.338 155.219C298.896 157.273 301.088 161.07 301.088 165.178V273.822C301.088 277.93 298.896 281.727 295.338 283.781L201.25 338.103C197.692 340.157 193.308 340.157 189.75 338.103L95.6619 283.781C92.1038 281.727 89.9119 277.93 89.9119 273.822V165.178C89.9119 161.07 92.1038 157.273 95.6619 155.219L189.75 100.897Z"
              stroke={theme === 'gold' ? '#FFE587' : '#24ADFA'}
              shapeRendering="crispEdges"
            />
          </g>
        </g>

        {/* Frame 3 */}
        <g
          ref={frame3Ref}
          opacity="0.6"
          filter={
            theme === 'gold'
              ? 'url(#filter4_d_5348_37972)'
              : 'url(#filter4_d_5045_42301)'
          }>
          <path
            d="M187.255 59.2492C192.048 56.4822 197.952 56.4822 202.745 59.2492L329.476 132.417C334.268 135.184 337.221 140.298 337.221 145.832V292.168C337.221 297.702 334.268 302.816 329.476 305.583L202.745 378.751C197.952 381.518 192.048 381.518 187.255 378.751L60.5242 305.583C55.7316 302.816 52.7793 297.702 52.7793 292.168V145.832C52.7793 140.298 55.7316 135.184 60.5242 132.417L187.255 59.2492Z"
            stroke={theme === 'gold' ? '#FFE587' : '#24ADFA'}
            strokeWidth="1.34694"
            shapeRendering="crispEdges"
          />
        </g>

        {/* Frame 4 */}
        <g
          ref={frame4Ref}
          opacity="0.2"
          filter={
            theme === 'gold'
              ? 'url(#filter5_d_5348_37972)'
              : 'url(#filter5_d_5045_42301)'
          }>
          <path
            d="M186.082 35.0445C191.6 31.8583 198.4 31.8583 203.918 35.0445L349.851 119.299C355.37 122.485 358.769 128.373 358.769 134.746V303.254C358.769 309.627 355.37 315.515 349.851 318.701L203.918 402.956C198.4 406.142 191.6 406.142 186.082 402.956L40.149 318.701C34.6303 315.515 31.2307 309.627 31.2307 303.254V134.746C31.2307 128.373 34.6303 122.485 40.149 119.299L186.082 35.0445Z"
            stroke={theme === 'gold' ? '#FFE587' : '#24ADFA'}
            strokeWidth="1.55102"
            shapeRendering="crispEdges"
          />
        </g>

        {/* Frame 5 */}
        <g
          ref={frame5Ref}
          opacity="0.1"
          filter={
            theme === 'gold'
              ? 'url(#filter6_d_5348_37972)'
              : 'url(#filter6_d_5045_42301)'
          }>
          <path
            d="M184.908 10.8398C191.153 7.23437 198.847 7.23437 205.092 10.8398L370.226 106.18C376.471 109.786 380.318 116.449 380.318 123.66V314.34C380.318 321.551 376.471 328.214 370.226 331.82L205.092 427.16C198.847 430.766 191.153 430.766 184.908 427.16L19.7739 331.82C13.5291 328.214 9.68209 321.551 9.68209 314.34V123.66C9.68209 116.449 13.5291 109.786 19.7739 106.18L184.908 10.8398Z"
            stroke={theme === 'gold' ? '#FFE587' : '#24ADFA'}
            strokeWidth="1.7551"
            shapeRendering="crispEdges"
          />
        </g>

        <defs>
          <filter
            id="filter0_d_5045_42301"
            x="5.88945"
            y="19.0564"
            width="379.221"
            height="412.887"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="6" />
            <feGaussianBlur stdDeviation="34.4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.137255 0 0 0 0 0.47451 0 0 0 0 0.976471 0 0 0 0.5 0"
            />
            <feBlend
              mode="difference"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter1_d_5045_42301"
            x="64.6895"
            y="71.8564"
            width="261.621"
            height="295.287"
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
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.138412 0 0 0 0 0.474079 0 0 0 0 0.977579 0 0 0 1 0"
            />
            <feBlend
              mode="exclusion"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter2_d_5045_42301"
            x="84.8119"
            y="95.2564"
            width="221.376"
            height="250.487"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="2.3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter3_d_5045_42301"
            x="148.981"
            y="172"
            width="94.5527"
            height="87.3857"
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
            <feGaussianBlur stdDeviation="4.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.155823 0 0 0 0 0.632966 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter4_d_5045_42301"
            x="45.9098"
            y="51.6515"
            width="298.18"
            height="337.391"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1.34694" />
            <feGaussianBlur stdDeviation="3.09796" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter5_d_5045_42301"
            x="23.3204"
            y="26.2957"
            width="343.359"
            height="388.511"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1.55102" />
            <feGaussianBlur stdDeviation="3.56735" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter6_d_5045_42301"
            x="0.730974"
            y="0.939934"
            width="388.538"
            height="439.63"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1.7551" />
            <feGaussianBlur stdDeviation="4.03673" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5045_42301"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5045_42301"
              result="shape"
            />
          </filter>

          <filter
            id="filter0_d_5348_37972"
            x="5.88945"
            y="19.0564"
            width="379.221"
            height="412.887"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="6" />
            <feGaussianBlur stdDeviation="34.4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.898039 0 0 0 0 0.529412 0 0 0 0.5 0"
            />
            <feBlend
              mode="difference"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5348_37972"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5348_37972"
              result="shape"
            />
          </filter>

          <filter
            id="filter1_d_5348_37972"
            x="64.6895"
            y="71.8564"
            width="261.621"
            height="295.287"
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
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.898039 0 0 0 0 0.529412 0 0 0 1 0"
            />
            <feBlend
              mode="exclusion"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5348_37972"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5348_37972"
              result="shape"
            />
          </filter>

          <filter
            id="filter2_d_5348_37972"
            x="84.8119"
            y="95.2564"
            width="221.376"
            height="250.487"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="2.3" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5348_37972"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5348_37972"
              result="shape"
            />
          </filter>

          <filter
            id="filter3_f_5348_37972"
            x="96.5"
            y="112.5"
            width="196.636"
            height="206"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25.75"
              result="effect1_foregroundBlur_5348_37972"
            />
          </filter>

          <filter
            id="filter4_f_5348_37972"
            x="150"
            y="179"
            width="38"
            height="68"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="5"
              result="effect1_foregroundBlur_5348_37972"
            />
          </filter>

          <filter
            id="filter5_f_5348_37972"
            x="161.364"
            y="198.364"
            width="16.2727"
            height="32.2727"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1.81818"
              result="effect1_foregroundBlur_5348_37972"
            />
          </filter>

          <filter
            id="filter6_f_5348_37972"
            x="203"
            y="183"
            width="38"
            height="63"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="5"
              result="effect1_foregroundBlur_5348_37972"
            />
          </filter>

          <filter
            id="filter7_f_5348_37972"
            x="214.364"
            y="205.364"
            width="16.2727"
            height="29.2727"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1.81818"
              result="effect1_foregroundBlur_5348_37972"
            />
          </filter>

          <filter
            id="filter8_d_5348_37972"
            x="45.9098"
            y="51.651"
            width="298.18"
            height="337.392"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1.34694" />
            <feGaussianBlur stdDeviation="3.09796" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5348_37972"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5348_37972"
              result="shape"
            />
          </filter>

          <filter
            id="filter9_d_5348_37972"
            x="23.3204"
            y="26.2952"
            width="343.359"
            height="388.512"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1.55102" />
            <feGaussianBlur stdDeviation="3.56735" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5348_37972"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5348_37972"
              result="shape"
            />
          </filter>

          <filter
            id="filter10_d_5348_37972"
            x="0.730974"
            y="0.939445"
            width="388.538"
            height="439.631"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1.7551" />
            <feGaussianBlur stdDeviation="4.03673" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.539075 0 0 0 0 0.799598 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5348_37972"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5348_37972"
              result="shape"
            />
          </filter>

          <linearGradient
            id="paint0_linear_5045_42301"
            x1="195.5"
            y1="80"
            x2="310.5"
            y2="290"
            gradientUnits="userSpaceOnUse">
            <stop stopColor={theme === 'gold' ? '#000000' : '#161C30'} />
            <stop
              offset="1"
              stopColor={theme === 'gold' ? '#FFE587' : '#24ADFA'}
            />
          </linearGradient>

          <linearGradient
            id="paint1_linear_5045_42301"
            x1="195.5"
            y1="80"
            x2="310.5"
            y2="290"
            gradientUnits="userSpaceOnUse">
            <stop stopColor={theme === 'gold' ? '#000000' : '#161C30'} />
            <stop
              offset="1"
              stopColor={theme === 'gold' ? '#FEDD3C' : '#24ADFA'}
            />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles['icon-container']}>
        <div className={styles.icon} ref={iconRef}></div>
      </div>
    </div>
  );
});

export default MainButton;
