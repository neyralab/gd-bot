import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';
import gsap from 'gsap';

import { getKeyTranslate } from '../../../translation/utils';
import translateEng from '../../../translation/locales/en/system.json';
import ListLoader from '../ListLoader/ListLoader';

import styles from './styles.module.css';

export default function Mission({ tasks, isLoading }) {
  const { t } = useTranslation('system');

  useEffect(() => {
    /** Animation */
    if (!tasks || !tasks.length) return;

    gsap.fromTo(
      `[data-animation="mission-animation-1"]`,
      {
        opacity: 0,
        x: window.innerWidth + 200,
        y: -window.innerHeight + 500,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(0.2)'
      }
    );
  }, [tasks]);

  const onDownloadClick = useCallback(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    const os = md.mobile();
    const url =
      os?.toLowerCase() === 'iphone'
        ? 'https://apps.apple.com/ua/app/ghostdrive-app/id6475002179'
        : 'https://play.google.com/store/apps/details?id=com.wise.data.ghostdrive';
    window.open(url);
  }, []);

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <div>
      <ul className={styles.list}>
        {tasks.map((task, index) => {
          return (
            <li
              data-animation="mission-animation-1"
              onClick={
                task?.action.toLowerCase()?.includes('download')
                  ? onDownloadClick
                  : undefined
              }
              key={task.id}
              className={CN(task?.done && styles.done, styles.item)}>
              <p className={styles.item_text}>
                {t(
                  getKeyTranslate(
                    translateEng,
                    task?.point?.text || task?.text || ''
                  )
                )}
              </p>
              <p
                className={
                  styles.point
                }>{`+${task.amount} ${task.amount > 1 ? t('task.points') : t('task.point')}`}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
