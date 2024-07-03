import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { useDispatch } from 'react-redux';
import { Sheet } from 'react-modal-sheet';

import {
  checkTgChatJoin,
  checkXJoin,
  checkYoutubeJoin
} from '../../../effects/EarnEffect';
import { updatePoints } from '../../../store/reducers/userSlice';

import { ReactComponent as CloseIcon } from '../../../assets/close.svg';
import SystemModal from '../../../components/SystemModal/SystemModal';

import classNames from 'classnames';
import styles from './EarnModal.module.css';

const EarnModal = forwardRef(({ item }, ref) => {
  const modalRef = useRef(null);
  const systemModalRef = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: open
  }));

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const checkSocials = async (id) => {
    let fn;

    switch (id) {
      case 'joinTG':
        fn = checkTgChatJoin;
        break;
      case 'youtube':
        fn = checkYoutubeJoin;
        break;
      case 'followX':
        fn = checkXJoin;
        break;
    }

    const res = fn ? await fn() : null;

    if (res === 'success') {
      dispatch(updatePoints(item?.points));
      systemModalRef.current.open({
        title: 'Success!',
        text: 'You joined our TG Channel',
        actions: [
          {
            type: 'default',
            text: 'OK',
            onClick: () => {
              systemModalRef.current.close();
            }
          }
        ]
      });
    } else if (res === 'You are not a member of this channel') {
      systemModalRef.current.open({
        title: 'Oops!',
        text: 'You did not join our TG Chanel',
        actions: [
          {
            type: 'default',
            text: 'Try again',
            onClick: () => {
              checkSocials(id);
              systemModalRef.current.close();
            }
          }
        ]
      });
    } else if (res === 'You have already received points') {
      systemModalRef.current.open({
        title: 'Oops!',
        text: 'You have already received points',
        actions: [
          {
            type: 'default',
            text: 'OK',
            onClick: () => {
              systemModalRef.current.close();
            }
          }
        ]
      });
    } else {
      systemModalRef.current.open({
        title: 'Oops!',
        text: 'Something went wrong! Please try again',
        actions: [
          {
            type: 'default',
            text: 'OK',
            onClick: () => {
              systemModalRef.current.close();
            }
          }
        ]
      });
    }
  };

  const drawJoinButton = useMemo(() => {
    if (!item) return null;

    if (item.joinLink) {
      return (
        <a
          href={item.joinLink}
          target="_blank"
          className={classNames(styles.button, styles['join-button'])}>
          {item.id === 'downloadMobileApp' ? 'Download' : 'Join'}
        </a>
      );
    } else {
      return null;
    }
  }, [item]);

  const drawCheckButton = useMemo(() => {
    if (!item) return null;

    switch (item.id) {
      case 'joinTG':
      case 'youtube':
      case 'followX':
        return (
          <button
            className={classNames(styles.button, styles['check-button'])}
            onClick={() => checkSocials(item.id)}>
            Check
          </button>
        );
      default:
        return null;
    }
  }, [item]);

  if (!item) return;

  return (
    <>
      <Sheet
        ref={modalRef}
        isOpen={isOpen}
        onClose={close}
        detent="content-height">
        <Sheet.Container className="react-modal-sheet-container">
          <Sheet.Header className="react-modal-sheet-header" />
          <Sheet.Content>
            <Sheet.Scroller>
              <div className={styles.container}>
                <div className={styles.header}>
                  <div className={styles.points}>
                    <span>{item.points.toLocaleString()}</span>
                    <img src="/assets/token.png" />
                  </div>
                  <div className={styles.close} onClick={close}>
                    <CloseIcon />
                  </div>
                </div>

                <div className={styles.content}>
                  <img src={item.imgUrl} alt={item.title} />
                  <h3>{item.title}</h3>
                </div>

                <div className={styles.actions}>
                  {drawJoinButton}
                  {drawCheckButton}
                </div>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>

      <SystemModal ref={systemModalRef} />
    </>
  );
});

export default EarnModal;
