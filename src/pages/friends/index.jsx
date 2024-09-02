import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
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
  title: 'Invite 25 Premium friends',
  points: '1M',
  imgUrl: '/assets/likeGold.png',
  translatePath: 'friends.invitePremiumFriend'
};

export default function FriendsPage() {
  const link = useSelector((state) => state.user.link);
  const { t } = useTranslation('game');
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendsAreLoading, setFriendsAreLoading] = useState(true);
  const [defaultPoints, setDefaultPoints] = useState('0');
  const [showContent, setShowContent] = useState(false);
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
    if (friendsAreLoading || !tasks || !tasks.length) {
      setShowContent(false);
    } else {
      setShowContent(true);
    }
  });

  useEffect(() => {
    /** Animation */

    if (!showContent) return;

    gsap.fromTo(
      `[data-animation="task-animation-1"]`,
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

    gsap.fromTo(
      `[data-animation="friends-animation-2"]`,
      {
        opacity: 0,
        x: window.innerWidth + 200,
        y: -100,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.4,
        delay: tasks.length * 0.05,
        ease: 'power1.out'
      }
    );

    gsap.fromTo(
      `[data-animation="friends-animation-3"]`,
      {
        opacity: 0,
        x: 100,
        y: -30,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        delay: tasks.length * 0.05 + 0.1,
        ease: 'back.out(0.2)'
      }
    );

    gsap.fromTo(
      `[data-animation="person-animation-1"]`,
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
        delay: tasks.length * 0.05 + 0.13,
        ease: 'back.out(0.2)'
      }
    );
  }, [showContent]);

  return (
    <div className={styles.container}>
      <div className={styles['title-block']}>
        <h1>{t('friends.inviteGetBonus')}</h1>
      </div>

      {!showContent && (
        <div className={styles['loader-container']}>
          <LoaderIcon />
        </div>
      )}

      {showContent && (
        <>
          <div className={styles['tasks-list']}>
            {tasks.map((task) => {
              return (
                <Task
                  key={task.id}
                  isDone={task.isDone}
                  title={task.title}
                  points={task.points}
                  imgUrl={task.imgUrl}
                  translatePath={getKeyTranslate(gameJson, task.title)}
                  className={styles['initial-state-for-animation']}
                />
              );
            })}
          </div>

          <TelegramShareButton
            className={styles['invite-button']}
            url={link.copy}
            title={t('friends.inviteFriend')}
            onClick={handleVibrationClick()}>
            <span
              data-animation="friends-animation-2"
              className={styles['initial-state-for-animation']}>
              {t('friends.inviteFriend')}
            </span>
          </TelegramShareButton>

          <div className={styles['friends-container']}>
            <h2
              data-animation="friends-animation-3"
              className={styles['initial-state-for-animation']}>
              {t('friends.yourFriends')}{' '}
              {friendsAreLoading ? '' : `(${friends.length || 0})`}
            </h2>

            {!friendsAreLoading && (
              <div className={styles['friends-list']}>
                {friends.map((friend) => {
                  return (
                    <Person
                      key={friend.username}
                      title={'@' + friend.username}
                      points={defaultPoints}
                      className={styles['initial-state-for-animation']}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <Menu />
    </div>
  );
}
