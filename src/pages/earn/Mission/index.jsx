import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import { getKeyTranslate } from '../../../translation/utils';
import translateEng from '../../../translation/locales/en/system.json';

import styles from './styles.module.css';

export default function Mission({ tasks }) {
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const { t } = useTranslation('system');

  useEffect(() => {
    const notAnimatedTasks = tasks.filter((el) => !animatedTaskIds.has(el.id));

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
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

  return (
    <div>
      <ul className={styles.list}>
        {tasks.map((task, index) => {
          if (animatedTaskIds.has(task.id)) {
            return (
              <li
              onClick={
                task?.action.toLowerCase()?.includes('download')
                  ? onDownloadClick
                  : undefined
              }
              key={index}
              className={CN(task?.done && styles.done, styles.item)}>
              <p className={styles.item_text}>
                {t(getKeyTranslate(translateEng, task?.point?.text || task?.text || ''))}
              </p>
              <p
                className={
                  styles.point
                }>{`+${task.amount} ${task.amount > 1 ? t('task.points') : t('task.point')}`}</p>
            </li>
            )
          } else {
            return null;
          }
        })}
      </ul>
    </div>
  );
}
