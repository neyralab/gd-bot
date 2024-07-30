import React, { useState, useEffect } from 'react';
import useButtonVibration from '../../../hooks/useButtonVibration';

import Task from '../../../components/Task/Task';

const tasks = []

export default function Mission() {
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

  return (
    <div>
      {tasks.map((task) => {
        if (animatedTaskIds.has(task.id)) {
          return (
            <Task
              key={task.id}
              onClick={handleVibrationClick(() => handleClick(task))}
              isDone={task.isDone}
              points={task.points}
              imgUrl={task.imgUrl}
              translatePath={task.translatePath}
              onTasksRequireCheck={() => {}}
            />
          )
        } else {
          return null;
        }
      })}
    </div>
  );
}
