import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Wave from './Wave';

const Waves = forwardRef((_, ref) => {
  const [waves, setWaves] = useState([]);

  const runWaveAnimation = () => {
    const waveId = Date.now();
    setWaves((prevWaves) => [...prevWaves, waveId]);
  };

  const removeWave = (id) => {
    setWaves((prevWaves) => prevWaves.filter((el) => el !== id));
  };

  useImperativeHandle(ref, () => ({
    runWaveAnimation: runWaveAnimation
  }));

  return (
    <group>
      {waves.map((el) => (
        <Wave key={el} onComplete={() => removeWave(el)} />
      ))}
    </group>
  );
});

export default Waves;
