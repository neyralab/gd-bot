import React from 'react';
import { useSelector } from 'react-redux';

export default function DebugButton() {
  const state = useSelector((state) => state.game);

  const clickHandler = () => {
    navigator.clipboard.writeText(JSON.stringify(state));
  };

  return (
    <div
      onClick={clickHandler}
      style={{
        width: '100px',
        height: '100px',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: '99999999999999999999'
      }}></div>
  );
}
