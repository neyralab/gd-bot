type UploadFileDataCallbacks = Record<
  string,
  (params: Record<string, any>) => void
>;

export const uploadFileData = {
  callbacks: {
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    onProgress: () => {}
  } as UploadFileDataCallbacks,
  handlers: ['onStart', 'onSuccess', 'onError', 'onProgress']
};
