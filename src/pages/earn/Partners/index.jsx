import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { checkTaskIsDone } from '../../../effects/EarnEffect';
import useButtonVibration from '../../../hooks/useButtonVibration';
import { PARTNER_KEY } from './utils';
import Task from '../TaskItem/Task';
import ClaimPoints from '../../../components/ClaimPoints/ClaimPoints';

import styles from './styles.module.css';

export default function Partners({ partners, setPartners }) {
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const handleVibrationClick = useButtonVibration();
  const { t } = useTranslation('system');
  const claimPointsModalRef = useRef(null);

  useEffect(() => {
    const notAnimatedTasks = partners.filter(
      (el) => !animatedTaskIds.has(el.id)
    );

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
  }, [partners]);

  const handleClick = (task) => {
    window.open(task.joinLink, '_blank');
  };

  const doVerify = useCallback(async (id) => {
    try {
      const res = await checkTaskIsDone(id);
      if (res.success) {
        const taskList = JSON.parse(localStorage.getItem(PARTNER_KEY) || []);
        localStorage.setItem(
          PARTNER_KEY,
          JSON.stringify(taskList.filter((item) => item !== id))
        );
        setPartners(
          partners.map((item) =>
            item.id === id ? { ...item, done: true } : item
          )
        );

        const partner = partners.find((item) => item.id == id);
        claimPointsModalRef.current.open(partner.rewardParams);
      } else {
        toast.error(t('message.tryAgain'), {
          theme: 'colored',
          position: 'bottom-center',
          autoClose: 5000
        });
      }
    } catch (error) {
      toast.error(t('message.tryAgain'), {
        theme: 'colored',
        position: 'bottom-center',
        autoClose: 5000
      });
    }
  }, []);

  return (
    <>
      <div className={styles['tasks-list']}>
        {partners.map((task) => {
          if (animatedTaskIds.has(task.id)) {
            return (
              <Task
                key={task.id}
                doVerify={doVerify}
                onClick={handleVibrationClick(() => handleClick(task))}
                {...task}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <ClaimPoints ref={claimPointsModalRef} />
    </>
  );
}
