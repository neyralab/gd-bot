import React, { useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { toggleFileFavorite } from '../../../../../store/reducers/driveSlice';
import { ReactComponent as FavIcon } from '../../../../../assets/like.svg';
import { vibrate } from '../../../../../utils/vibration';
import { animateButton } from '../animations';
import styles from '../DefaultFileActions.module.scss';

export default function FavoriteAction({ file }) {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(file?.user_favorites?.length > 0);

  const clickHandler = (e) => {
    vibrate();
    animateButton(e.currentTarget);
    dispatch(toggleFileFavorite({ slug: file.slug }));
    setIsActive(!isActive);
  };

  return (
    <div
      onClick={clickHandler}
      className={classNames(styles.action, isActive && styles.active)}>
      <FavIcon />
    </div>
  );
}
