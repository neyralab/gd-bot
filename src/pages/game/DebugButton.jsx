import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DebugButton() {
  const state = useSelector((state) => state.game);
  const navigate = useNavigate();

  const clipboardHandler = () => {
    navigator.clipboard.writeText(JSON.stringify(state));
  };

  const game3DHandler = () => {
    navigate('/game-3d');
  };

  return (
    <>
      <div
        onClick={game3DHandler}
        style={{
          width: '25px',
          height: '25px',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: '99999999999999999999',
        }}></div>
      <div
        onClick={clipboardHandler}
        style={{
          width: '100px',
          height: '100px',
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: '99999999999999999999'
        }}></div>
    </>
  );
}
