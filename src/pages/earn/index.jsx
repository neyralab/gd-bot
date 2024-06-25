import React, { useState, useEffect } from 'react';
import { Header } from '../../components/header';
import Menu from '../../components/Menu/Menu';
import Task from './Task/Task';
import { tasks as tasksFromFile } from './tasks';
import styles from './styles.module.css';

export default function EarnPage() {
  const [tasks, setTasks] = useState([]);
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());

  useEffect(() => {
    setTasks(tasksFromFile);
  }, []);

  useEffect(() => {
    const notAnimatedTasks = tasks.filter((el) => !animatedTaskIds.has(el.id));

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
  }, [tasks]);

  const handleClick = (id) => {
    switch (id) {
      default:
        console.log(id);
        break;
    }
  };

  return (
    <div className={styles.container}>
      <Header label={'Earn'} />

      <div className={styles['title-block']}>
        <img src="/assets/earn-page/token.png" alt="Token" />
        <h1>Earn more points</h1>
      </div>

      <div className={styles['tasks-list']}>
        {tasks.map((task) => {
          if (animatedTaskIds.has(task.id)) {
            return (
              <Task
                key={task.id}
                onClick={() => handleClick(task.id)}
                isDone={task.isDone}
                title={task.title}
                points={task.points}
                imgUrl={task.imgUrl}
              />
            );
          } else {
            return null;
          }
        })}
      </div>

      <Menu />
    </div>
  );
}
