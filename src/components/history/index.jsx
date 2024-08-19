import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NoHistory } from './empty';
import { getHistoryTranslate } from '../../translation/utils';
import gameJson from '../../translation/locales/en/game.json';
import { ReactComponent as Cloud } from '../../assets/clock.svg';
import { getBalanceEffect } from '../../effects/balanceEffect';
import Loader2 from '../Loader2/Loader2';
import styles from './styles.module.css';

export const History = () => {
  const { t } = useTranslation('game');
  const [isLoading, setIsLoading] = useState(true);
  const [firstDataLoaded, setFirstDataLoaded] = useState(false);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const observer = useRef();

  useEffect(() => {
    getData(page);
  }, [page]);

  const getData = async (page) => {
    setIsLoading(true);

    try {
      const res = await getBalanceEffect({ page });
      console.log('history', res);
      setHistory((prevHistory) => [...prevHistory, ...res.data.data]);
      setTotalPages(Math.ceil(res.data.total / 50)); // Assuming 50 items per page
      setIsLoading(false);
      setFirstDataLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, page, totalPages]
  );

  return (
    <div className={styles.container}>
      <p className={styles.history}>{t('airdrop.history')}</p>
      <ul className={styles.list}>
        {!history?.length || !firstDataLoaded ? (
          <NoHistory loading={!firstDataLoaded} />
        ) : (
          history.map((el, index) => (
            <li
              key={index}
              className={styles.item}
              ref={index === history.length - 1 ? lastElementRef : null}>
              <Cloud width={32} height={32} />
              <div className={styles.text_container}>
                <p className={styles.value}>{el.points}</p>
                <p className={styles.text}>
                  {getHistoryTranslate(
                    gameJson,
                    el?.text || el?.point?.text,
                    t
                  ) || el?.text}
                </p>
              </div>
            </li>
          ))
        )}

        {isLoading && firstDataLoaded && (
          <div className={styles['list-loader']}>
            <Loader2 />
            <span>Loading...</span>
          </div>
        )}
      </ul>
    </div>
  );
};
