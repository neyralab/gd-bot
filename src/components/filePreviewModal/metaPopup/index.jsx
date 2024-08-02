import moment from 'moment';
import { SlidingModal } from '../../slidingModal';

import { transformSize } from '../../../utils/transformSize';

import style from './style.module.scss';
import CopyButton from '../../copyButton';

const MetaPopup = ({ file, setInfoPopupOpen, infoPopupOpen }) => {
  const formattedDate = moment
    .unix(file.created_at)
    .format('MMM D, YYYY, HH:mm');
  const hashLink = `https://filfox.info/en/block/${file?.ipfs_hash}`;

  const copyHash = () => {
    navigator.clipboard.writeText(hashLink);
  };
  return (
    <SlidingModal
      isOpen={infoPopupOpen}
      onClose={() => {
        setInfoPopupOpen(false);
      }}
      snapPoints={[300, 275, 125, 0]}
      backgroundClass={style.background}>
      <div className={style.wrapper}>
        <h2 className={style.fileName}>{file.name}</h2>
        <h3 className={style.title}>Meta</h3>
        <ul className={style.list}>
          <li className={style.item}>
            Type: <span>{file.extension}</span>
          </li>
          <li className={style.item}>
            Size: <span>{transformSize(file.size)}</span>
          </li>
          <li className={style.item}>
            Hash: <span>{file?.ipfs_hash}</span>{' '}
            {file?.ipfs_hash && <CopyButton onClick={copyHash} />}
          </li>
          <li className={style.item}>
            Created: <span>{formattedDate}</span>
          </li>
          <li className={style.item}>
            Owner:{' '}
            <span>{file?.user?.displayed_name || file?.user?.username}</span>
          </li>
        </ul>
      </div>
    </SlidingModal>
  );
};

export default MetaPopup;
