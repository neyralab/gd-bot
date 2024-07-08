import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

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
import useButtonVibration from '../../hooks/useButtonVibration';

import style from './style.module.css';

export const DeleteFileModal = () => {
  const dispatch = useDispatch();
  const file = useSelector(selecSelectedFile);
  const isOpen = useSelector(selectisDeleteFileModalOpen);
  const location = useLocation();
  const handleVibrationClick = useButtonVibration();
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
      toast('File was successfully deleted', {
        position: 'bottom-center',
        className: style.notification,
        progressClassName: style.progress
      });
    } else {
      toast.error('Something went wrong', {
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
        <button className={style.noBtn} onClick={handleVibrationClick(onClose)}>
          No
        </button>
        <button
          className={style.yesBtn}
          onClick={handleVibrationClick(onAccept)}>
          Yes
        </button>
      </div>
    </Modal>
  );
};
