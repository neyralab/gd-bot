import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from "../../components/header";
import { getAllPartners } from '../../effects/EarnEffect';
import { SearchInput } from "./SearchInput";
import Game from './GameItem';
import { handlePartners, selectPartners } from '../../store/reducers/taskSlice';

import { GAMES } from './games.js';

import styles from './styles.module.css';

const formaData = (list, t) => {
  return list.map((item) => {
    const selectedGame = Object.values(GAMES)
    .find((game) => game.name === item.name)
    if (selectedGame) {
      return ({
        ...item,
        ...selectedGame,
        translatedText: t(selectedGame.translate).replace('{name}', selectedGame.productName)
      })
    } else {
      return ({ ...item, gameTranslate: "", translate: "", image: "" })
    }
  })
}

export const GamesPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('game');
  const { games } = useSelector(selectPartners);
  const [list, setList] = useState(formaData(games, t));
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!games?.length) {
      getAllPartners()
        .then((data) => dispatch(handlePartners(data)))
    } else {
      setList(formaData(games, t))
    }
  }, [games])

  const handleChange =  useCallback((value) => {
    setSearch(value);
    if (value) {
      const filteredList = formaData(games, t).
        filter((item) => (item.name.toLowerCase().includes(value.toLowerCase())));
      setList(filteredList);
    } else {
      setList(formaData(games, t));
    }
  }, [t])

  return (
    <div className={styles.container}>
      <Header label="Ghost Drive" />
      <SearchInput
        value={search}
        setValue={handleChange}
      />
      <ul className={styles.gameList}>
        {list.map((item) => (
          <Game
            title={item.title}
            joinLink={item.url}
            translatedText={item.translatedText}
            logo={item.logo}
          />
        ))}
      </ul>
    </div>
  )
}
