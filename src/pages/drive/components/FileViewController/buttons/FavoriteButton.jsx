import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { ReactComponent as FavoriteIcon } from '../../../../../assets/favorite.svg';
import { ReactComponent as FavoriteActiveIcon } from '../../../../../assets/favorite_active.svg';
import Loader2 from '../../../../../components/Loader2/Loader2';
import styles from './buttons.module.scss';

export default function FavoriteButton({
  isFavorite,
  viewType,
  slug,
  onFavoriteClick
}) {
  const fileIsFavoriteUpdating = useSelector(
    (state) => state.drive.fileIsFavoriteUpdating
  );
  const isUpdating = useMemo(() => {
    return !!fileIsFavoriteUpdating.find((el) => el === slug);
  }, [fileIsFavoriteUpdating]);

  return (
    <button
      className={classNames(
        styles.fileMenuButton,
        viewType === 'grid' ? styles.favBtnGrid : styles.favBtnList
      )}
      onClick={onFavoriteClick}>
      {isUpdating && <Loader2 />}
      {!isUpdating && (
        <>{isFavorite ? <FavoriteActiveIcon /> : <FavoriteIcon />}</>
      )}
    </button>
  );
}
