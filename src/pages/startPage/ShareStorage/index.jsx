import React from "react";

import { SlidingModal } from '../../../components/slidingModal';
import { useKeyboardStatus } from '../../../utils/useKeyboardStatus';

import GiftPreview from './Gift';
import ShareForm from './ShareForm';

const snapPoints = {
  gift: [420, 420, 50, 0],
  form: [360, 360, 50, 0]
}

const ShareStorage = ({ isOpen, onClose, giftData, onCloseGift, systemModalRef }) => {
  const isKeybordOpen = useKeyboardStatus();

  return (
    <SlidingModal
      onClose={!!giftData.length ? onCloseGift: onClose }
      isOpen={isOpen}
      snapPoints={ isKeybordOpen ? undefined : (!!giftData.length? snapPoints.gift : snapPoints.form)}
      detent={isKeybordOpen && "full-height"}
    >
    {!!giftData.length ? (
      <GiftPreview systemModalRef={systemModalRef} giftData={giftData} onCloseGift={onCloseGift} />
      ) : (<ShareForm onClose={onClose} />
    )}
    </SlidingModal>
  )
}

export default ShareStorage;