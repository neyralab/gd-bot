import React, { useEffect, useRef } from 'react';
import { useAssistantAudio } from '../../AssistantAudio/AssistantAudio';
import styles from './Equalizer.module.scss';

export default function Equalizer() {
  const { isSpeaking, analyserRef } = useAssistantAudio();
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawVisual = () => {
      animationIdRef.current = requestAnimationFrame(drawVisual);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.lineWidth = 3;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    drawVisual();
  };

  useEffect(() => {
    if (isSpeaking) {
      draw();
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationIdRef.current);
    }
  }, [isSpeaking]);

  return (
    <div className={styles.equalizer}>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
}
