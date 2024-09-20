import React from 'react';
import { SlidingModal } from '../../../../components/slidingModal';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { setFileInfoModal } from '../../../../store/reducers/driveSlice';
import { transformSize } from '../../../../utils/transformSize';
import CopyButton from '../../../../components/copyButton';
import styles from './FileInfoModal.module.scss';

export default function FileInfoModal() {
  const dispatch = useDispatch();
  const file = useSelector((state) => state.drive.fileInfoModal);
  const formattedDate = moment
    .unix(file.created_at)
    .format('MMM D, YYYY, HH:mm');
  const hashLink = `https://filfox.info/en/block/${file?.cid}`;

  const copyHash = () => {
    navigator.clipboard.writeText(hashLink);
  };

  const onClose = () => {
    dispatch(setFileInfoModal(null));
  };

  return (
    <SlidingModal
      isOpen={!!file}
      onClose={onClose}
      snapPoints={[300, 275, 125, 0]}
      backgroundClass={styles.background}>
      {file && (
        <div className={styles.wrapper}>
          <h2 className={styles.fileName}>{file.name}</h2>
          <h3 className={styles.title}>Meta</h3>
          <ul className={styles.list}>
            <li className={styles.item}>
              Type: <span>{file.extension}</span>
            </li>
            <li className={styles.item}>
              Size: <span>{transformSize(file.size)}</span>
            </li>
            {file?.cid && (
              <li className={styles.item}>
                Hash: <span>{file?.cid}</span>
                <CopyButton onClick={copyHash} />
              </li>
            )}
            <li className={styles.item}>
              Created: <span>{formattedDate}</span>
            </li>
            <li className={styles.item}>
              Owner:{' '}
              <span>{file?.user?.displayed_name || file?.user?.username}</span>
            </li>
          </ul>
        </div>
      )}
    </SlidingModal>
  );
}
