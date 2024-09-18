import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  handleDeleteFileModal,
  handleFileMenu,
  selectisDeleteFileModalOpen
} from '../../store/reducers/modalSlice';
import {
  selecSelectedFile,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import {
  deleteFileEffect,
  permanentlyDeleteFileEffect
} from '../../effects/file/deleteFileEffect';

import style from './style.module.css';

export const DeleteFileModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const file = useSelector(selecSelectedFile);
  const isOpen = useSelector(selectisDeleteFileModalOpen);
  const location = useLocation();
  const isDeletedPage =
    location.pathname === '/file-upload' &&
    new URLSearchParams(location.search).get('type') === 'delete';

  const onClose = () => {
    dispatch(handleDeleteFileModal(false));
    dispatch(handleFileMenu(false));
    dispatch(setSelectedFile({}));
  };

  const onAccept = async () => {
    let result;
    if (isDeletedPage) {
      result = await permanentlyDeleteFileEffect(file, dispatch);
    } else {
      result = await deleteFileEffect(file.slug, dispatch);
    }
    onClose();
    if (result === 'success') {
      toast(t('message.fileDeleted'), {
        position: 'bottom-center',
        className: style.notification,
        progressClassName: style.progress
      });
    } else {
      toast.error(t('message.error'), {
        theme: 'colored',
        position: 'bottom-center'
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName={style.overlay}
      className={style.modal}>
      <p className={style.text}>
        {isDeletedPage
          ? 'Are you sure you want to delete this file permanently? This action cannot be undone'
          : 'Are you sure you want to delete?'}
      </p>
      <div className={style.buttons}>
        <button className={style.noBtn} onClick={onClose}>
          No
        </button>
        <button
          className={style.yesBtn}
          onClick={onAccept}>
          Yes
        </button>
      </div>
    </Modal>
  );
};
