import React, { useRef } from 'react';
import { Sheet } from 'react-modal-sheet';
import CN from 'classnames';

import './style.css';

export const SlidingModal = ({
  onClose,
  isOpen,
  children,
  backgroundClass,
  ...rest
}) => {
  const ref = useRef();

  return (
    <Sheet
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[175, 90, 50, 0]}
      initialSnap={1}
      {...rest}>
      <Sheet.Container
        className={CN('react-modal-sheet-container', backgroundClass)}>
        <Sheet.Header className="react-modal-sheet-header" />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};
