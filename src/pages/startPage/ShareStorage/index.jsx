import React, { useState } from "react";

import { SlidingModal } from '../../../components/slidingModal';

import GiftPreview from './Gift';
import ShareForm from './ShareForm';
import { isPhone } from "../../../utils/client";

const snapPoints = {
  gift: [420, 420, 50, 0],
  form: [360, 360, 50, 0]
}

const ShareStorage = ({ isOpen, onClose, giftData, onCloseGift, systemModalRef }) => {
  const [fullScreen, setFullScreen] = useState(false)

  const handleFullScreeView = (state) => {
    if (isPhone()) {
      setFullScreen(state);
    }
  } 

  return (
    <SlidingModal
      onClose={!!giftData.length ? onCloseGift: onClose }
      isOpen={isOpen}
      snapPoints={ fullScreen ? undefined : (!!giftData.length? snapPoints.gift : snapPoints.form)}
      detent={fullScreen && "full-height"}
    >
    {!!giftData.length ? (
      <GiftPreview systemModalRef={systemModalRef} giftData={giftData} onCloseGift={onCloseGift} />
      ) : (<ShareForm handleFullScreeView={handleFullScreeView} onClose={onClose} />
    )}
    </SlidingModal>
  )
}

export default ShareStorage;