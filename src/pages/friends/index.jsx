import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import Menu from '../../components/Menu/Menu';
import Task from '../../components/Task/Task';
import { tasks as tasksFromFile } from './tasks';
import Person from '../../components/Person/Person';
import styles from './styles.module.css';
import { getFriends } from '../../effects/friendsEffect';
import { ReactComponent as LoaderIcon } from '../../assets/loader.svg';
import { getAllTasks } from '../../effects/balanceEffect';
import { handleTasks } from '../../store/reducers/taskSlice';
import useButtonVibration from '../../hooks/useButtonVibration';
import { getKeyTranslate } from '../../translation/utils/index';
import gameJson from '../../translation/locales/en/game.json';

const FRIEND_TASK = {
  id: 'invite_more',
  isDone: false,
  title: "Invite 25 Premium friends",
  points: '1M',
  imgUrl: '/assets/likeGold.png',
  translatePath: 'friends.invitePremiumFriend',
}

export default function FriendsPage() {
  const link = useSelector((state) => state.user.link);
  const { t } = useTranslation('game');
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendsAreLoading, setFriendsAreLoading] = useState(true);
  const [animatedTaskIds, setAnimatedTaskIds] = useState(new Set());
  const [animatedFriendIds, setAnimatedFriendIds] = useState(new Set());
  const [defaultPoints, setDefaultPoints] = useState('0');
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    getAllTasks().then((res) => {
      dispatch(handleTasks(res));
      setTasks([
        ...tasksFromFile.map((el) => {
          const realTask = res.find((task) => task.action === el.action);
          return realTask ? { ...el, points: realTask?.amount || 0 } : el;
        }),
        FRIEND_TASK
      ]);
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
        <h1>{t('friends.inviteGetBonus')}</h1>
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
                translatePath={getKeyTranslate(gameJson, task.title)}
              />
            );
          } else {
            return null;
          }
        })}
      </div>

      <TelegramShareButton
        className={styles['invite-button']}
        url={link.copy}
        title={t('friends.inviteFriend')}
        onClick={handleVibrationClick()}>
        <span>{t('friends.inviteFriend')}</span>
      </TelegramShareButton>

      <div className={styles['friends-container']}>
        <h2>
          {t('friends.yourFriends')} {friendsAreLoading ? '' : `(${friends.length || 0})`}
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

      <Menu />
    </div>
  );
}
