import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TelegramShareButton } from 'react-share';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  handleFileMenu,
  handlePaperViewModal,
  selectisFileMenuOpen,
} from '../../store/reducers/modalSlice';
import {
  selecSelectedFile,
  setSelectedFile,
  updateFile
} from '../../store/reducers/filesSlice';
import { updateShareEffect, deletePaidShareEffect } from '../../effects/filesEffects';
import { restoreFileEffect } from '../../effects/file/restoreFileEffect';
import { generateSharingLink } from '../../utils/generateSharingLink';
import { getPreviewFileType } from '../../utils/preview';
import { removeSlugHyphens } from '../../utils/string';
import useButtonVibration from '../../hooks/useButtonVibration';
import { BOT_NAME } from '../../utils/api-urls';

import { SlidingModal } from '../slidingModal';

import { ReactComponent as ShareArrowIcon } from '../../assets/arrow_share.svg';
import { ReactComponent as RestoreIcon } from '../../assets/restore.svg';
import { ReactComponent as PenIcon } from '../../assets/pen.svg';
import ToggleSwitch from '../toggleSwitch';

import style from './style.module.css';

export const FileMenu = () => {
  const { t : tSystem } = useTranslation('system');
  const isOpen = useSelector(selectisFileMenuOpen);
  const handleVibrationClick = useButtonVibration();
  const file = useSelector(selecSelectedFile);
  const { t } = useTranslation('drive');
  const location = useLocation();
  const dispatch = useDispatch();
  const isPPVActivated = useMemo(() => !!file?.share_file, [file?.share_file]);
  const isFileHavePreview = useMemo(() => !!getPreviewFileType(file, '', true), [file])
  const url = useMemo(() => {
    if (isPPVActivated) {
      return `https://t.me/${BOT_NAME}?start=paylink_${removeSlugHyphens(file.slug)}`;
    }
    return generateSharingLink(file.slug);
  }, [file, isPPVActivated]);
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

  const activatePayShare = async () => {
    try {
      if (isPPVActivated) {
        await deletePaidShareEffect(file.share_file.id);
        dispatch(updateFile({ ...file, share_file: null }));
        dispatch(setSelectedFile({ ...file, share_file: null }))
      } else {
        dispatch(handleFileMenu(false));
        dispatch(handlePaperViewModal(true));
      }
    } catch (error) {
      console.warn(error)
    }
  }

  const onEditPPV = () => {
    dispatch(handleFileMenu(false));
    dispatch(handlePaperViewModal(true));
  }

  return (
    <SlidingModal
      onClose={onClose}
      isOpen={isOpen}
      snapPoints={isPPVActivated ? [155, 155, 50, 0] : [175, 90, 50, 0]}
    >
      <ul className={style.menu}>
        {!isDeletedPage && (
          <>
            <li className={style.menu__item}>
              <TelegramShareButton
                url={url}
                title={isPPVActivated ? '' : `${'dashbord.linkToFile'} "${file.name}"`}
                onClick={handleVibrationClick(onShareClick)}
                className={style.shareOption}>
                <ShareArrowIcon />
                <span className={style.menu__item__title}>{t('dashbord.share')}</span>
              </TelegramShareButton>
              { isFileHavePreview && (
                <div className={style.menu__item_switch}>
                  <span>{t('ppv.ppv')}</span>
                  <ToggleSwitch
                    checked={isPPVActivated}
                    onClick={activatePayShare}
                  />
                </div>
              )}
            </li>
            {isPPVActivated && (
              <li onClick={onEditPPV} className={style.menu__item}>
                  <PenIcon />
                  <span className={style.menu__item__title}>{t('ppv.edit')}</span>
              </li>
            )}
          </>
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
