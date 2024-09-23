import React, { useRef, useEffect, forwardRef } from 'react';

const AutosizeInput = forwardRef(function MyInput({
  type = 'text',
  value,
  className,
  onChange,
  ...rest
}, ref) {
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      ref.current.style.width = `${spanRef.current.offsetWidth}px`;
      ref.current.value = value;
    }
  }, [value, spanRef, ref]);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={handleChange}
        style={{ width: 'auto' }}
        {...rest}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre'
        }}
      >
        {value}
      </span>
    </div>
  );
});

export { AutosizeInput };
