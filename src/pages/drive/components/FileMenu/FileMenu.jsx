import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TelegramShareButton } from 'react-share';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { handlePaperViewModal } from '../../../../store/reducers/modalSlice';
import {
  setPPVFile,
  setFileMenuFile,
  updateFileProperty
} from '../../../../store/reducers/driveSlice';
import {
  updateShareEffect,
  deletePaidShareEffect
} from '../../../../effects/filesEffects';
import { restoreFileEffect } from '../../../../effects/file/restoreFileEffect';
import { generateSharingLink } from '../../../../utils/generateSharingLink';
import { getPreviewFileType } from '../../../../utils/preview';
import { removeSlugHyphens } from '../../../../utils/string';
import { vibrate } from '../../../../utils/vibration';
import { BOT_NAME } from '../../../../utils/api-urls';
import { isDevEnv } from '../../../../utils/isDevEnv';

import { ReactComponent as ShareArrowIcon } from '../../../../assets/arrow_share.svg';
import { ReactComponent as RestoreIcon } from '../../../../assets/restore.svg';
import { ReactComponent as PenIcon } from '../../../../assets/pen.svg';

import style from './FileMenu.module.scss';
import { SlidingModal } from '../../../../components/slidingModal';
import ToggleSwitch from '../../../../components/toggleSwitch';

export const FileMenu = () => {
  const { t: tSystem } = useTranslation('system');
  const file = useSelector((state) => state.drive.fileMenuFile);
  const { t } = useTranslation('drive');
  const location = useLocation();
  const dispatch = useDispatch();
  const isDev = useMemo(() => isDevEnv(), []);
  const isPPVActivated = useMemo(() => !!file?.share_file, [file?.share_file]);
  const fileHasPreview = useMemo(
    () => (!!getPreviewFileType(file, '', true) && isDev),
    [file, isDev]
  );
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
    dispatch(setFileMenuFile(null));
  };

  const onShareClick = async (e) => {
    e.stopPropagation();
    vibrate();
    await updateShareEffect(file.slug);
    dispatch(setFileMenuFile(null));
  };

  const onRestoreClick = async () => {
    vibrate();
    const result = await restoreFileEffect(file.slug, dispatch);
    dispatch(setFileMenuFile(null));
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
        dispatch(
          updateFileProperty({
            id: file.id,
            property: 'share_file',
            value: null
          })
        );
        dispatch(setFileMenuFile({ ...file, share_file: null }));
      } else {
        dispatch(handlePaperViewModal(true));
        dispatch(setPPVFile(file));
        dispatch(setFileMenuFile(null));
      }
      
    } catch (error) {
      console.warn(error);
    }
  };

  const onEditPPV = () => {
    dispatch(setFileMenuFile(null));
    dispatch(handlePaperViewModal(true));
    dispatch(setPPVFile(file));
  };

  return (
    <SlidingModal
      onClose={onClose}
      isOpen={!!file}
      snapPoints={isPPVActivated ? [184, 184, 50, 0] : [120, 110, 50, 0]}>
      <ul className={style.menu}>
        {!isDeletedPage && (
          <>
            <li className={style.menu__item}>
              <TelegramShareButton
                url={url}
                title={
                  isPPVActivated
                    ? ''
                    : `${'dashbord.linkToFile'} "${file.name}"`
                }
                onClick={onShareClick}
                className={style.shareOption}>
                <ShareArrowIcon />
                <span className={style.menu__item__title}>
                  {t('dashbord.share')}
                </span>
              </TelegramShareButton>
              {fileHasPreview && (
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
            onClick={onRestoreClick}>
            <RestoreIcon />
            <span className={style.menu__item__title}>Restore</span>
          </li>
        )}
        {/* <li
          className={style.menu__item}
          onClick={onDeleteClick)>
          <DeleteIcon />
          <span className={cn(style.menu__item__title, style.deleteTitle)}>
            {isDeletedPage ? 'Delete permanently' : 'Delete'}
          </span>
        </li> */}
      </ul>
    </SlidingModal>
  );
};
