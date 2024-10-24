import React, { useEffect, useRef } from 'react';
import styles from './RecordButtonEqualizer.module.scss';
import { useAssistantAudio } from '../../../../pages/assistant/AssistantAudio/AssistantAudio';

export default function RecordButtonEqualizer() {
  // const { analyserRef, isRecording } = useAssistantAudio();
  // const rippleRef = useRef(null);

  // useEffect(() => {
  //   let animationFrameId;
  //   let audioContext;
  //   let analyser;
  //   let source;

  //   if (isRecording) {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true })
  //       .then((stream) => {
  //         audioContext = new AudioContext();
  //         source = audioContext.createMediaStreamSource(stream);
  //         analyser = audioContext.createAnalyser();
  //         analyser.fftSize = 256;
  //         const bufferLength = analyser.frequencyBinCount;
  //         const dataArray = new Uint8Array(bufferLength);
  //         source.connect(analyser);

  //         const updateRippleOpacity = () => {
  //           analyser.getByteFrequencyData(dataArray); // Update dataArray with current frequency data

  //           const averageVolume =
  //             dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

  //           const amount = averageVolume / 255;
  //           const scale = 0.5 + amount * 2 * (1.2 - 0.5);

  //           if (rippleRef.current) {
  //             rippleRef.current.style.opacity = (amount * 4).toString();
  //             rippleRef.current.style.transform = `scale(${scale})`;
  //           }

  //           animationFrameId = requestAnimationFrame(updateRippleOpacity);
  //         };

  //         updateRippleOpacity();
  //       })
  //       .catch((err) => {
  //         console.error('Error accessing the microphone', err);
  //       });
  //   } else {
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //     if (audioContext) {
  //       audioContext.close();
  //     }
  //     if (rippleRef.current) {
  //       rippleRef.current.style.opacity = '0';
  //       rippleRef.current.style.transform = `scale(0)`;
  //     }
  //   }

  //   return () => {
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //     if (audioContext) {
  //       audioContext.close();
  //     }
  //   };
  // }, [isRecording]);

  // return (
  //   <div className={styles.rippleContainer}>
  //     <div ref={rippleRef} className={styles.ripple}></div>
  //   </div>
  // );
}
