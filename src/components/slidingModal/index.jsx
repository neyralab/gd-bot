import React, { useRef } from 'react';
import { Sheet } from 'react-modal-sheet';

import './style.css';

export const SlidingModal = ({ onClose, isOpen, children }) => {
  const ref = useRef();

  return (
    <Sheet
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[150, 125, 50, 0]}
      initialSnap={1}>
      <Sheet.Container className="react-modal-sheet-container">
        <Sheet.Header className="react-modal-sheet-header" />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};
