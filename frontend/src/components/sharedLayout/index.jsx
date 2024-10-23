import React from 'react';

// import { DeleteFileModal } from '../deleteFileModal';
import { ToastContainer } from 'react-toastify';
import PPVModal from '../ppvModal/PPVModal';
import { AssistantAudioProvider } from '../AssistantDashboard/AssistantAudio/AssistantAudio';

import { ReactComponent as CancelIcon } from '../../assets/cancel.svg';

import 'react-toastify/dist/ReactToastify.css';

const SharedLayout = ({ children }) => {
  const CloseNotificationButton = ({ closeToast }) => (
    <button onClick={closeToast}>
      <CancelIcon />
    </button>
  );
  return (
    <AssistantAudioProvider>
      <div className="App">
        {children}
        {/*<DeleteFileModal />*/}
        <PPVModal />
        <ToastContainer closeButton={CloseNotificationButton} />
      </div>
    </AssistantAudioProvider>
  );
};

export default SharedLayout;
