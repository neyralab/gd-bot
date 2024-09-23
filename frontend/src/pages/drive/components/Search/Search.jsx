import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { ReactComponent as SearchIcon } from '../../../../assets/search.svg';
import { ReactComponent as CloseIcon } from '../../../../assets/cross.svg';
import { assignFilesQueryData } from '../../../../store/reducers/driveSlice';
import styles from './Search.module.scss';

export default function Search() {
  const { t } = useTranslation('drive');
  const dispatch = useDispatch();

  const searchValue = useSelector((state) => state.drive.filesQueryData.search);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = async (e) => {
    const query = e.target.value.trim();
    dispatch(assignFilesQueryData({ filesQueryData: { search: query } }));
  };

  const clearValue = () => {
    dispatch(assignFilesQueryData({ filesQueryData: { search: null } }));
  };

  return (
    <div
      data-animation="search-animation-1"
      className={classNames(styles.search, isFocused && styles.focused)}>
      <DebounceInput
        minLength={1}
        debounceTimeout={500}
        name="search"
        id="search"
        maxLength="40"
        placeholder={t('dashbord.search')}
        className={styles.input}
        autoComplete="off"
        value={searchValue || ''}
        onChange={handleInputChange}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
      />

      {!searchValue && (
        <label htmlFor="search" className={styles.icon}>
          <SearchIcon />
        </label>
      )}

      {searchValue && (
        <button className={styles.icon} onClick={clearValue}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
