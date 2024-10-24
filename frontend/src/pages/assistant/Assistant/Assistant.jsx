import React, { useEffect, useRef } from 'react';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import HelmetDecor from './HelmetDecor/HelmetDecor';
import Equalizer from './Equalizer/Equalizer';
import styles from './Assistant.module.scss';

export default function Assistant() {
  const { isSpeaking, analyserRef } = useAssistantAudio();
  const soundReflectRef = useRef(null);
  const animationIdRef = useRef(null);

  const scaleSoundReflect = () => {
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);

      const additionalScaleRange = 0.07; // How far we need to scale
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const scale = 1 + (average / 256) * additionalScaleRange;

      if (soundReflectRef.current) {
        soundReflectRef.current.style.transform = `scale(${scale})`;
      }
    };

    animate();
  };

  useEffect(() => {
    if (isSpeaking) {
      scaleSoundReflect();
    } else {
      if (soundReflectRef.current) {
        soundReflectRef.current.style.transform = 'scale(1)';
      }
      cancelAnimationFrame(animationIdRef.current);
    }
  }, [isSpeaking]);

  return (
    <div className={styles.container}>
      <div ref={soundReflectRef} className={styles['sound-reflect']}>
        <div className={styles['captain-container']}>
          <div
            className={styles.captain}
            style={{ backgroundImage: 'url(/assets/assistant/captain.png)' }}>
            {/* <HelmetDecor /> */}
            <Equalizer />
          </div>
        </div>
      </div>
    </div>
  );
}
