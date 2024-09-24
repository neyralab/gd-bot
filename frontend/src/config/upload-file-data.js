import {
  changeTimeLeft,
  changeuploadingProgress
} from '../store/reducers/filesSlice';

const updateProgressCallback = ({ id, progress, timeLeft, dispatch }) => {
  dispatch(
    changeuploadingProgress({
      progress,
      id: id
    })
  );
  dispatch(
    changeTimeLeft({
      timeLeft,
      id: id
    })
  );
};

export const uploadFileData = {
  callbacks: {
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    onProgress: updateProgressCallback
  },
  handlers: ['onStart', 'onSuccess', 'onError', 'onProgress']
};
