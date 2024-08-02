import React from 'react';

import { FileMenu } from '../fileMenu';
import { DeleteFileModal } from '../deleteFileModal';
import { FilePreviewModal } from '../filePreviewModal';
import { ToastContainer } from 'react-toastify';

import { ReactComponent as CancelIcon } from '../../assets/cancel.svg';

import 'react-toastify/dist/ReactToastify.css';

const SharedLayout = ({ children }) => {
  const CloseNotificationButton = ({ closeToast }) => (
    <button onClick={closeToast}>
      <CancelIcon />
    </button>
  );
  return (
    <div className="App">
      {children}
      <FileMenu />
      <DeleteFileModal />
      <FilePreviewModal />
      <ToastContainer closeButton={CloseNotificationButton} />
    </div>
  );
};

export default SharedLayout;
