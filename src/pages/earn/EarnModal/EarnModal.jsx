import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import { Sheet } from 'react-modal-sheet';
import classNames from 'classnames';
import { ReactComponent as CloseIcon } from '../../../assets/close.svg';
import { checkTgChatJoin } from '../../../effects/EarnEffect';
import SystemModal from '../../../components/SystemModal/SystemModal';
import styles from './EarnModal.module.css';

const EarnModal = forwardRef(({ item }, ref) => {
  const link = useSelector((state) => state.user.link);
  const modalRef = useRef(null);
  const systemModalRef = useRef(null);
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

  const checkTelegram = async () => {
    const res = await checkTgChatJoin();
    if (!res) {
      systemModalRef.current.open({
        title: 'Oops!',
        text: 'You did not join our TG Chanel',
        actions: [
          {
            type: 'default',
            text: 'Try again',
            onClick: () => {
              checkTelegram();
              systemModalRef.current.close();
            }
          }
        ]
      });
    } else {
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

    if (item.id === 'joinTG') {
      return (
        <button
          className={classNames(styles.button, styles['check-button'])}
          onClick={checkTelegram}>
          Check
        </button>
      );
    } else return null;
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
