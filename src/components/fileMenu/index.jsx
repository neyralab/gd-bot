import { TelegramShareButton } from 'react-share';

import { updateShareEffect } from '../../effects/filesEffects';

import { SlidingModal } from '../slidingModal';

import { ReactComponent as ShareArrowIcon } from '../../assets/arrow_share.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import cn from 'classnames';
import style from './style.module.css';

export const FileMenu = ({ isOpen, onClose, file }) => {
  const url = `https://neyratech.com/file/${file.slug}?is_telegram=true`;

  const onShareClick = async (e) => {
    e.stopPropagation();
    await updateShareEffect(file.slug);
  };

  return (
    <SlidingModal onClose={onClose} isOpen={isOpen}>
      <ul className={style.menu}>
        <li className={style.menu__item}>
          <TelegramShareButton
            url={url}
            title={`Tap this link to see the file "${file.name}"`}
            onClick={onShareClick}
            className={style.shareOption}>
            <ShareArrowIcon />
            <span className={style.menu__item__title}>Share</span>
          </TelegramShareButton>
        </li>
        <li className={style.menu__item}>
          <DeleteIcon />
          <span className={cn(style.menu__item__title, style.deleteTitle)}>
            Delete
          </span>
        </li>
      </ul>
    </SlidingModal>
  );
};
