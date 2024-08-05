import React, { useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';

import { Header } from "../../components/header";
import { SearchInput } from "./SearchInput";
import Game from './GameItem';
import { tasks } from '../earn/Partners/partners';

import styles from './styles.module.css';

const formaData = (list, t) => {
  return list.map((item) => ({
    ...item,
    gameName: item.title.substring(5, item.title.length - 7),
    translatedText: t(item.translatePath)
      .replace('{name}', item.title.substring(4, item.title.length - 7))
  }))
}

export const GamesPage = () => {
  const { t } = useTranslation('game');
  const [list, setList] = useState(formaData(tasks, t));
  const [search, setSearch] = useState('');

  const handleChange =  useCallback((value) => {
    setSearch(value);
    if (value) {
      const filteredList = formaData(tasks, t).
        filter((item) => (item.gameName.toLowerCase().includes(value.toLowerCase())));
      setList(filteredList);
    } else {
      setList(formaData(tasks, t));
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
            isDone={false}
            title={item.title}
            points={item.points}
            imgUrl={item.imgUrl}
            joinLink={item.joinLink}
            translatedText={item.translatedText}
          />
        ))}
      </ul>
    </div>
  )
}
