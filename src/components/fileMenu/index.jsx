import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TelegramShareButton } from 'react-share';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  handleDeleteFileModal,
  handleFileMenu,
  selectisFileMenuOpen
} from '../../store/reducers/modalSlice';
import {
  selecSelectedFile,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { updateShareEffect } from '../../effects/filesEffects';
import { restoreFileEffect } from '../../effects/file/restoreFileEffect';
import { generateSharingLink } from '../../utils/generateSharingLink';

import { SlidingModal } from '../slidingModal';

import { ReactComponent as ShareArrowIcon } from '../../assets/arrow_share.svg';
import { ReactComponent as DeleteIcon } from '../../assets/trash.svg';
import { ReactComponent as RestoreIcon } from '../../assets/restore.svg';

import cn from 'classnames';
import style from './style.module.css';
import useButtonVibration from '../../hooks/useButtonVibration';

export const FileMenu = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('drive');
  const { t : tSystem } = useTranslation('system');
  const isOpen = useSelector(selectisFileMenuOpen);
  const file = useSelector(selecSelectedFile);
  const location = useLocation();
  const handleVibrationClick = useButtonVibration();

  const url = useMemo(() => {
    return generateSharingLink(file.slug);
  }, [file]);

  const isDeletedPage =
    location.pathname === '/file-upload' &&
    new URLSearchParams(location.search).get('type') === 'delete';

  const onClose = () => {
    dispatch(handleFileMenu(false));
    dispatch(setSelectedFile({}));
  };

  const onShareClick = async (e) => {
    e.stopPropagation();
    dispatch(handleFileMenu(false));
    await updateShareEffect(file.slug);
    dispatch(setSelectedFile({}));
  };

  const onDeleteClick = () => {
    dispatch(handleDeleteFileModal(true));
    dispatch(handleFileMenu(false));
  };

  const onRestoreClick = async () => {
    const result = await restoreFileEffect(file.slug, dispatch);
    dispatch(handleFileMenu(false));
    if (result === 'success') {
      toast.success(tSystem('message.fileRestored'), {
        position: 'bottom-center',
        theme: 'colored'
      });
    } else {
      toast.error(tSystem('message.error'), {
        theme: 'colored',
        position: 'bottom-center'
      });
    }
  };

  return (
    <SlidingModal onClose={onClose} isOpen={isOpen}>
      <ul className={style.menu}>
        {!isDeletedPage && (
          <li className={style.menu__item}>
            <TelegramShareButton
              url={url}
              title={`${'dashbord.linkToFile'} "${file.name}"`}
              onClick={handleVibrationClick(onShareClick)}
              className={style.shareOption}>
              <ShareArrowIcon />
              <span className={style.menu__item__title}>{t('dashbord.share')}</span>
            </TelegramShareButton>
          </li>
        )}
        {isDeletedPage && (
          <li
            className={style.menu__item}
            onClick={handleVibrationClick(onRestoreClick)}>
            <RestoreIcon />
            <span className={style.menu__item__title}>Restore</span>
          </li>
        )}
        {/* <li
          className={style.menu__item}
          onClick={handleVibrationClick(onDeleteClick)}>
          <DeleteIcon />
          <span className={cn(style.menu__item__title, style.deleteTitle)}>
            {isDeletedPage ? 'Delete permanently' : 'Delete'}
          </span>
        </li> */}
      </ul>
    </SlidingModal>
  );
};
