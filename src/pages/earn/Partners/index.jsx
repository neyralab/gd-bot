import React, { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { checkTaskIsDone } from '../../../effects/EarnEffect';
import { PARTNER_KEY } from './utils';
import Task from '../TaskItem/Task';
import ClaimPoints from '../../../components/ClaimPoints/ClaimPoints';
import ListLoader from '../ListLoader/ListLoader';
import { runInitAnimation } from './animations';

import styles from './styles.module.css';

export default function Partners({ partners, setPartners, isLoading }) {
  const { t } = useTranslation('system');
  const claimPointsModalRef = useRef(null);

  useEffect(() => {
    if (!partners || !partners.length) return;
    runInitAnimation();
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
        toast.error(t('message.ckeckError'), {
          theme: 'colored',
          position: 'bottom-center',
          autoClose: 5000,
          style: { backgroundColor: '#f4b20b' }
        });
      }
    } catch (error) {
      toast.error(t('message.ckeckError'), {
        theme: 'colored',
        position: 'bottom-center',
        autoClose: 5000,
        style: { backgroundColor: '#f4b20b' }
      });
    }
  }, []);

  if (isLoading) {
    return <ListLoader />;
  }

  return (
    <>
      <div className={styles['tasks-list']}>
        {partners.map((task) => {
          return (
            <Task
              key={task.id}
              doVerify={doVerify}
              onClick={() => handleClick(task)}
              {...task}
            />
          );
        })}
      </div>
      <ClaimPoints ref={claimPointsModalRef} />
    </>
  );
}
