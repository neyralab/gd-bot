import { useEffect, useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { NoHistory } from './empty';
import { getHistoryTranslate } from '../../translation/utils';
import gameJson from '../../translation/locales/en/game.json';
import { ReactComponent as ClockIcon } from '../../assets/clock.svg';
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
  const itemsPerPage = 50;
  const animatedItems = useRef(new Set());

  useEffect(() => {
    getData(page);
  }, [page]);

  const runItemsAnimation = (visibleStartIndex, visibleStopIndex) => {
    const newItems = [];
    for (let i = visibleStartIndex; i <= visibleStopIndex; i++) {
      if (!animatedItems.current.has(i) && i < history.length) {
        animatedItems.current.add(i);
        newItems.push(`[data-animation="history-animation-3"][data-index="${i}"]`);
      }
    }

    if (newItems.length > 0) {
      gsap.fromTo(
        newItems,
        {
          opacity: 0,
          x: 280,
          y: -40,
          scale: 0
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(0.5)'
        }
      );
    }
  };

  const getData = async (page) => {
    setIsLoading(true);

    try {
      const res = await getBalanceEffect({ page });
      setHistory((prevHistory) => [...prevHistory, ...res.data.data]);
      setTotalPages(Math.ceil(res.data.total / itemsPerPage));
      setIsLoading(false);
      setFirstDataLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const isItemLoaded = (index) => {
    return !!history[index];
  };

  const loadMoreItems = () => {
    if (!isLoading && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const LoaderRow = ({ style }) => {
    return (
      <div style={style} className={styles['list-loader']}>
        <Loader2 />
        <span>Loading...</span>
      </div>
    );
  };

  const Row = ({ index, style }) => {
    if (index === history.length) {
      if (isLoading) {
        return <LoaderRow style={style} />;
      } else {
        return null;
      }
    }

    const el = history[index];
    return (
      <li
        data-animation="history-animation-3"
        data-index={index}
        key={index}
        style={style}
        className={styles.item}>
        <div className={styles['item-inner-container']}>
          <ClockIcon width={32} height={32} />
          <div className={styles.text_container}>
            <p className={styles.value}>{el.points}</p>
            <p className={styles.text}>
              {getHistoryTranslate(gameJson, el?.text || el?.point?.text, t) ||
                el?.text}
            </p>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className={styles.container}>
      <p data-animation="history-animation-1" className={styles.history}>
        {t('airdrop.history')}
      </p>

      <div className={styles.list}>
        {!history?.length || !firstDataLoaded ? (
          <NoHistory loading={!firstDataLoaded} />
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={totalPages * itemsPerPage + 1} // + 1 item as loader
                loadMoreItems={loadMoreItems}>
                {({ ref }) => (
                  <List
                    height={height + 110}
                    itemCount={history.length + 1} // + 1 item as loader
                    itemSize={68}
                    width={width}
                    className={styles.list}
                    onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
                      if (visibleStopIndex >= history.length - 2) {
                        loadMoreItems();
                      }
                      runItemsAnimation(visibleStartIndex, visibleStopIndex);
                    }}
                    ref={ref}>
                    {Row}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};
