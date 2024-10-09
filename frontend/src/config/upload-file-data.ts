interface UploadFileDataCallbacks {
  [key: string]: (params: { [key: string]: any }) => void;
}

export const uploadFileData = {
  callbacks: {
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    onProgress: () => {}
  } as UploadFileDataCallbacks,
  handlers: ['onStart', 'onSuccess', 'onError', 'onProgress']
};
