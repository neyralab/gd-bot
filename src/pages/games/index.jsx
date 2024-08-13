import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Header } from "../../components/header";
import { getAllPartners } from '../../effects/EarnEffect';
import { SearchInput } from "./SearchInput";
import Game from './GameItem';
import { handlePartners, selectPartners } from '../../store/reducers/taskSlice';

import styles from './styles.module.css';

export const GamesPage = () => {
  const dispatch = useDispatch();
  const { games } = useSelector(selectPartners);
  const [list, setList] = useState(games);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!games?.length) {
      getAllPartners()
        .then((data) => dispatch(handlePartners(data)))
    } else {
      setList(games)
    }
  }, [games])

  const handleChange =  useCallback((value) => {
    setSearch(value);
    if (value) {
      const filteredList = games.
        filter((item) => (item.name.toLowerCase().includes(value.toLowerCase())));
      setList(filteredList);
    } else {
      setList(games);
    }
  }, [])

  return (
    <div className={styles.container}>
      <Header />
      <SearchInput
        value={search}
        setValue={handleChange}
      />
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
    </div>
  )
}
