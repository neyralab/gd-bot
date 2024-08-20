import React from "react";

import { SlidingModal } from '../../../components/slidingModal';

import GiftPreview from './Gift';
import ShareForm from './ShareForm';

const snapPoints = {
  gift: [420, 420, 50, 0],
  form: [360, 360, 50, 0]
}

const ShareStorage = ({ isOpen, onClose, giftData, onCloseGift, systemModalRef }) => (
  <SlidingModal
    onClose={!!giftData.length ? onCloseGift: onClose }
    isOpen={isOpen}
    snapPoints={!!giftData.length ? snapPoints.gift : snapPoints.form }
  >
  {!!giftData.length ? (
    <GiftPreview systemModalRef={systemModalRef} giftData={giftData} onCloseGift={onCloseGift} />
    ) : (<ShareForm onClose={onClose} />
  )}
  </SlidingModal>
)

export default ShareStorage;