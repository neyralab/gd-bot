import CN from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MobileDetect from 'mobile-detect';

import { Header } from '../../components/header';
import { getAllTasks, getBalanceEffect } from '../../effects/balanceEffect';
import { handleTasks } from '../../store/reducers/taskSlice';

import styles from './styles.module.css';

export const TaskPage = () => {
  const [tasks, setTasks] = useState();
  const dispatch = useDispatch();

  const onDownloadClick = useCallback(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    const os = md.mobile();
    const url =
      os?.toLowerCase() === 'iphone'
        ? 'https://apps.apple.com/ua/app/ghostdrive-app/id6475002179'
        : 'https://play.google.com/store/apps/details?id=com.wise.data.ghostdrive';
    window.open(url);
  }, []);

  useEffect(() => {
    (async () => {
      const allTasks = await getAllTasks();
      dispatch(handleTasks(allTasks));
      const {
        data: { data: userTasks }
      } = await getBalanceEffect();
      const realTasks = allTasks.map((task) =>
        userTasks.find((userTask) => task.action === userTask?.point?.action)
          ? { ...task, done: true }
          : { ...task, done: false }
      );
      console.log({ realTasks });
      setTasks(realTasks.sort((a, b) => a.amount - b.amount));
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Header label={'Task'} />
      {/*<p className={styles.checkbox_header}>Daily Task</p>*/}
      {/*<div className={styles.checkbox_item}>*/}
      {/*  <div className={styles.input_container}>*/}
      {/*    <label htmlFor="send">Send 0.01</label>*/}
      {/*  </div>*/}
      {/*  <p className={styles.point}>+50 Points</p>*/}
      {/*</div>*/}
      <div className={styles.tasks}>
        <p className={styles.checkbox_header}>All Tasks</p>
        <ul className={styles.list}>
          {tasks?.map((el, index) => (
            <li
              onClick={
                el?.action.toLowerCase()?.includes('download')
                  ? onDownloadClick
                  : undefined
              }
              key={index}
              className={CN(el?.done && styles.done, styles.item)}>
              <p className={styles.item_text}>
                {el?.point?.action_text || el?.action_text}
              </p>
              <p
                className={
                  styles.point
                }>{`+${el.amount} ${el.amount > 1 ? 'Points' : 'Point'}`}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
