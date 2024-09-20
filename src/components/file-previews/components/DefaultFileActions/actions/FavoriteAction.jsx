import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as FavIcon } from '../../../../../assets/like.svg';
import { vibrate } from '../../../../../utils/vibration';
import { animateButton } from '../animations';
import styles from '../DefaultFileActions.module.scss';

export default function FavoriteAction({ file, onFavoriteClick }) {
  const [isActive, setIsActive] = useState(file?.user_favorites?.length > 0);

  const clickHandler = (e) => {
    vibrate();
    animateButton(e.currentTarget);
    onFavoriteClick?.(file);
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(file?.user_favorites?.length > 0);
  }, [file]);

  return (
    <div
      onClick={clickHandler}
      className={classNames(styles.action, isActive && styles.active)}>
      <FavIcon />
    </div>
  );
}
