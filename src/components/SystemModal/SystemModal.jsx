import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo
} from 'react';
import Modal from 'react-modal';

import useButtonVibration from '../../hooks/useButtonVibration';

import styles from './SystemModal.module.css';

const SystemModal = forwardRef(({ handleClose }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [actions, setActions] = useState([]);
  const handleVibrationClick = useButtonVibration();

  /**  PARAMS:
   * title: string
   * text: string
   * actions: Array of {title: string, text: string, onClick: Fn}
   * */
  const open = ({ title, text, actions }) => {
    setTitle(title);
    setText(text);
    setActions(actions);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTitle('');
    setText('');
    setActions([]);
    handleClose && handleClose();
  };

  useImperativeHandle(ref, () => ({
    open: open,
    close: close
  }));

  const drawActions = useMemo(() => {
    if (!actions || actions.length <= 0) return null;

    return actions.map((el) => {
      return (
        <button
          key={el.text}
          className={styles['button-type__' + el.type]}
          onClick={handleVibrationClick(el.onClick)}>
          {el.text}
        </button>
      );
    });
  }, [actions]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
      overlayClassName={styles.overlay}
      className={styles.modal}
      ariaHideApp={false}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
      </div>
      {actions && <div className={styles.buttons}>{drawActions}</div>}
    </Modal>
  );
});

export default SystemModal;
