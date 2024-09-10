import React from "react";

import { SlidingModal } from '../../../components/slidingModal';
import GiftPreview from './Gift';
import ShareForm from './ShareForm';

import styles from './styles.module.css';

const snapPoints = {
  gift: [420, 420, 50, 0],
  form: [280, 280, 0, 0]
}

const ShareStorage = ({ isOpen, onClose, systemModalRef, giftToken }) => {
  return (
    <SlidingModal
      onClose={onClose }
      isOpen={isOpen}
      snapPoints={!!giftToken ? snapPoints.gift : snapPoints.form}
      backgroundClass={styles.modal}
    >
    {giftToken ? (
      <GiftPreview
        systemModalRef={systemModalRef}
        onClose={onClose}
        giftToken={giftToken}
      />
      ) : (<ShareForm onClose={onClose} />
    )}
    </SlidingModal>
  )
}

export default ShareStorage;