import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { gsap } from 'gsap';
import { useAssistantAudio } from '../AssistantAudio/AssistantAudio';
import styles from './CirclularPanel.module.scss';

export default function CirclularPanel() {
  const { isSpeaking } = useAssistantAudio();

  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);

  const layerTimelines = useRef([]);

  const createLayerTimeline = (element, duration, ease, yoyo = false) => {
    const timeline = gsap.timeline({ repeat: -1, ease, yoyo });
    timeline
      .to(element, {
        transform: 'translate(-50%, -50%) rotate(35deg) translate(0.5%, 0.2%)',
        opacity: 0.4,
        duration
      })
      .to(element, {
        transform: 'translate(-50%, -50%) rotate(0) translate(0, 0)',
        opacity: 0.4,
        duration
      })
      .to(element, {
        transform:
          'translate(-50%, -50%) rotate(-35deg) translate(-0.2%, -0.7%)',
        opacity: 0.6,
        duration
      })
      .to(element, {
        transform: 'translate(-50%, -50%) rotate(0) translate(0, 0)',
        opacity: 0.2,
        duration
      });
    return timeline;
  };

  const initializeTimelines = () => {
    layerTimelines.current = [
      createLayerTimeline(layer1Ref.current, 4, 'power1.inOut'),
      createLayerTimeline(layer2Ref.current, 3.2, 'power1.inOut', true),
      createLayerTimeline(layer3Ref.current, 2.4, 'power1.inOut'),
      createLayerTimeline(layer4Ref.current, 1.2, 'power1.inOut', true)
    ];
  };

  useEffect(() => {
    initializeTimelines();

    const handleResize = () => {
      layerTimelines.current.forEach((timeline) => timeline.kill());
      initializeTimelines();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      layerTimelines.current.forEach((timeline) => timeline.kill());
    };
  }, []);

  useEffect(() => {
    const speedFactor = isSpeaking ? 3 : 1;
    layerTimelines.current.forEach((timeline) =>
      timeline.timeScale(speedFactor)
    );
  }, [isSpeaking]);

  return (
    <div className={styles.container}>
      <div
        ref={layer1Ref}
        className={classNames(styles.layer, styles.layer1)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-1.png)'
        }}></div>

      <div
        ref={layer2Ref}
        className={classNames(styles.layer, styles.layer2)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-2.png)'
        }}></div>

      <div
        ref={layer3Ref}
        className={classNames(styles.layer, styles.layer3)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-3.png)'
        }}></div>

      <div
        ref={layer4Ref}
        className={classNames(styles.layer, styles.layer4)}
        style={{
          backgroundImage: 'url(/assets/assistant/panel-lights-4.png)'
        }}></div>
    </div>
  );
}
