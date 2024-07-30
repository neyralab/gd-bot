import React, { useState, useEffect } from 'react';

import useButtonVibration from '../../../hooks/useButtonVibration';
import Task from '../TaskItem/Task';

import { tasks } from './partners';
import styles from './styles.module.css';

export default function Partners() {
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    const notAnimatedTasks = tasks.filter((el) => !animatedTaskIds.has(el.id));

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
  }, [tasks]);

  const handleClick = (task) => {
    window.open(task.joinLink, '_blank')
  };

  return (
    <div className={styles['tasks-list']}>
      {tasks.map((task) => {
        if (animatedTaskIds.has(task.id)) {
          return (
            <Task
              key={task.id}
              onClick={handleVibrationClick(() => handleClick(task))}
              isDone={task.isDone}
              points={task.points}
              imgUrl={task.imgUrl}
              title={task.title}
              translatePath={task.translatePath}
            />
          )
        } else {
          return null;
        }
      })}
    </div>
  );
}
