interface CallbackParams {
  [key: string]: any;
}

interface Callbacks {
  [key: string]: (params: CallbackParams) => void;
}

export const uploadFileData = {
  callbacks: {
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    onProgress: () => {}
  } as Callbacks,
  handlers: ['onStart', 'onSuccess', 'onError', 'onProgress']
};
