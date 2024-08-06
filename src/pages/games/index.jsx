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
    if (item) {
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
  const partners = useSelector(selectPartners);
  const [list, setList] = useState(formaData(partners, t));
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!partners?.length) {
      getAllPartners()
        .then((data) => dispatch(handlePartners(data)))
    } else {
      setList(formaData(partners, t))
    }
  }, [partners])

  const handleChange =  useCallback((value) => {
    setSearch(value);
    if (value) {
      const filteredList = formaData(partners, t).
        filter((item) => (item.name.toLowerCase().includes(value.toLowerCase())));
      setList(filteredList);
    } else {
      setList(formaData(partners, t));
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
            imgUrl={item.image}
            joinLink={item.url}
            translatedText={item.translatedText}
          />
        ))}
      </ul>
    </div>
  )
}
