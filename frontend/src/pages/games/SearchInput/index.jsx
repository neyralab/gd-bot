import React from 'react';
import { useTranslation } from 'react-i18next';
import { DebounceInput } from 'react-debounce-input';

import { ReactComponent as SearchIcon } from '../../../assets/search_input.svg';
import { ReactComponent as CloseIcon } from '../../../assets/cross.svg';

import { vibrate } from '../../../utils/vibration';

import style from './styles.module.css';

export const SearchInput = ({ value, setValue }) => {
  const { t } = useTranslation('drive');

  const handleInputChange = ({ target: { value } }) => {
    setValue(value);
  };

  const onClear = () => {
    vibrate();
    setValue('');
  };

  return (
    <div data-animation="games-search-animation-1" className={style.search}>
      <DebounceInput
        minLength={1}
        debounceTimeout={500}
        name="search"
        id="search"
        maxLength="40"
        placeholder={t('dashbord.search')}
        className={style.search__input}
        autoComplete="off"
        onChange={handleInputChange}
        value={value}
      />
      <label htmlFor="search" className={style.search__icon}>
        <SearchIcon viewBox="4 3 10 13" />
      </label>
      <div
        className={style.search__logo}
        onClick={onClear}>
        <CloseIcon />
      </div>
    </div>
  );
};
