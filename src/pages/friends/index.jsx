import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import Menu from '../../components/Menu/Menu';
import Task from '../../components/Task/Task';
import { tasks as tasksFromFile } from './tasks';
import Person from '../../components/Person/Person';
import styles from './styles.module.css';
import { getFriends } from '../../effects/friendsEffect';
import { ReactComponent as LoaderIcon } from '../../assets/loader.svg';
import { getAllTasks } from '../../effects/balanceEffect';
import { handleTasks } from '../../store/reducers/taskSlice';

export default function FriendsPage() {
  const link = useSelector((state) => state.user.link);
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendsAreLoading, setFriendsAreLoading] = useState(true);
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const [animatedFriendIds, setAnimatedFriendIds] = useState(new Set());
  const [defaultPoints, setDefaultPoints] = useState('0');

  useEffect(() => {
    getAllTasks().then((res) => {
      dispatch(handleTasks(res));
      setTasks(
        tasksFromFile.map((el) => {
          const realTask = res.find((task) => task.action === el.action);
          return realTask ? { ...el, points: realTask?.amount || 0 } : el;
        })
      );
    });

    setFriendsAreLoading(true);
    const response = getFriends();
    response.then((res) => {
      setFriendsAreLoading(false);
      setFriends(res?.data || []);
      const formattedPoints = new Intl.NumberFormat().format(res.points);
      setDefaultPoints(formattedPoints);
    });
  }, [dispatch]);

  useEffect(() => {
    const notAnimatedTasks = tasks.filter((el) => !animatedTaskIds.has(el.id));

    notAnimatedTasks.forEach((task, index) => {
      setTimeout(() => {
        setAnimatedTaskIds((prevIds) => new Set(prevIds).add(task.id));
      }, index * 100);
    });
  }, [tasks]);

  useEffect(() => {
    const notAnimatedFriends = friends.filter(
      (el) => !animatedFriendIds.has(el.username)
    );

    notAnimatedFriends.forEach((friend, index) => {
      setTimeout(() => {
        setAnimatedFriendIds((prevIds) =>
          new Set(prevIds).add(friend.username)
        );
      }, index * 100);
    });
  }, [friends]);

  return (
    <div className={styles.container}>
      <div className={styles['title-block']}>
        <img src="/assets/token_friends.png" alt="Token" />
        <h1>Invite friends and Get bonus!</h1>
      </div>

      <div className={styles['tasks-list']}>
        {tasks.map((task) => {
          if (animatedTaskIds.has(task.id)) {
            return (
              <Task
                key={task.id}
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

      <div className={styles['friends-container']}>
        <h2>
          Your Friends {friendsAreLoading ? '' : `(${friends.length || 0})`}
        </h2>

        {friendsAreLoading && (
          <div className={styles['loader-container']}>
            <LoaderIcon />
          </div>
        )}

        {!friendsAreLoading && (
          <div className={styles['friends-list']}>
            {friends.map((friend) => {
              if (animatedFriendIds.has(friend.username)) {
                return (
                  <Person
                    key={friend.username}
                    title={'@' + friend.username}
                    points={defaultPoints}
                  />
                );
              } else {
                return null;
              }
            })}
          </div>
        )}
      </div>

      <TelegramShareButton
        className={styles['invite-button']}
        url={link.copy}
        title={'Invite a friend'}>
        <span>Invite a friend</span>
      </TelegramShareButton>

      <Menu />
    </div>
  );
}
