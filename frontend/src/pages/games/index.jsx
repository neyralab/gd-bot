import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Header } from '../../components/header';
import { getAllPartners } from '../../effects/EarnEffect';
import { SearchInput } from './SearchInput';
import Game from './GameItem';
import { handlePartners, selectPartners } from '../../store/reducers/taskSlice';
import { isMobilePlatform } from '../../utils/client';

import styles from './styles.module.css';
import { runInitAnimation, runListAnimation } from './animations';
import GhostLoader from '../../components/ghostLoader';

export const GamesPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('drive');
  const { games } = useSelector(selectPartners);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getAllPartners()
      .then((data) => {
        dispatch(handlePartners(data));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.error(e);
      });

    runInitAnimation();
  }, []);

  useEffect(() => {
    setList(games);
  }, [games]);

  useEffect(() => {
    if (list.length && !isLoading) {
      runListAnimation();
    }
  }, [list]);

  const handleChange = (value) => {
    setSearch(value);

    if (value) {
      const filteredList = games.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setList(filteredList);
    } else {
      setList(games);
    }
  };

  return (
    <div className={styles.container}>
      <Header hideBack={isMobilePlatform} label={t('dashbord.games')} />
      <SearchInput value={search} setValue={handleChange} />
      {isLoading && (
        <div className={styles.loader}>
          <GhostLoader />
        </div>
      )}

      {!isLoading && (
        <ul className={styles.gameList}>
          {list.map((item) => (
            <Game
              key={item.id}
              title={item.description}
              joinLink={item.url}
              logo={item.logo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
