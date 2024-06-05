import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  handleDeleteFileModal,
  handleFileMenu,
  selectisDeleteFileModalOpen
} from '../../store/reducers/modalSlice';
import {
  selecSelectedFile,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { deleteFileEffect } from '../../effects/filesEffects';

import style from './style.module.css';

export const DeleteFileModal = () => {
  const dispatch = useDispatch();
  const file = useSelector(selecSelectedFile);
  const isOpen = useSelector(selectisDeleteFileModalOpen);

  const onClose = () => {
    dispatch(handleDeleteFileModal(false));
    dispatch(handleFileMenu(false));
    dispatch(setSelectedFile({}));
  };

  const onAccept = async () => {
    const result = await deleteFileEffect(file.slug, dispatch);
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
      <p className={style.text}>Are you sure you want to delete?</p>
      <div className={style.buttons}>
        <button className={style.noBtn} onClick={onClose}>
          No
        </button>
        <button className={style.yesBtn} onClick={onAccept}>
          Yes
        </button>
      </div>
    </Modal>
  );
};
