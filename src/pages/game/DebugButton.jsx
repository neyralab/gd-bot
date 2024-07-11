import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DebugButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const game3DHandler = () => {
    if (location.pathname === '/game') {
      navigate('/game-3d');
    }
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
          zIndex: '99999999999999999999'
        }}></div>
    </>
  );
}
