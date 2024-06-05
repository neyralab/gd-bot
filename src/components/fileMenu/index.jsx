import { TelegramShareButton } from 'react-share';
import { useDispatch, useSelector } from 'react-redux';

import {
  handleDeleteFileModal,
  handleFileMenu,
  selectisFileMenuOpen
} from '../../store/reducers/modalSlice';
import {
  selecSelectedFile,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { API_FILE_SHARING } from '../../utils/api-urls';
import { updateShareEffect } from '../../effects/filesEffects';

import { SlidingModal } from '../slidingModal';

import { ReactComponent as ShareArrowIcon } from '../../assets/arrow_share.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';

import cn from 'classnames';
import style from './style.module.css';

export const FileMenu = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectisFileMenuOpen);
  const file = useSelector(selecSelectedFile);
  const url = `${API_FILE_SHARING}/${file.slug}?is_telegram=true`;

  const onClose = () => {
    dispatch(handleFileMenu(false));
    dispatch(setSelectedFile({}));
  };

  const onShareClick = async (e) => {
    e.stopPropagation();
    await updateShareEffect(file.slug);
  };

  const onDeleteClick = () => {
    dispatch(handleDeleteFileModal(true));
    dispatch(handleFileMenu(false));
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
        <li className={style.menu__item} onClick={onDeleteClick}>
          <DeleteIcon />
          <span className={cn(style.menu__item__title, style.deleteTitle)}>
            Delete
          </span>
        </li>
      </ul>
    </SlidingModal>
  );
};
