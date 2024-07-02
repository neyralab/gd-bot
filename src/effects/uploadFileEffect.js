import {
  uploadFile,
  LocalFileBuffer,
  getThumbnailImage
} from 'gdgateway-client';
import { toast } from 'react-toastify';

import { getOneTimeToken } from './getOneTimeToken';
import { uploadFileData } from '../config/upload-file-data';
import { afterFileUploadAction } from '../store/reducers/filesSlice';
import imageFileExtensions, {
  imageMediaTypesPreview
} from '../config/image-file-extensions';

export const uploadFileEffect = async ({ files, dispatch }) => {
  let progresses = {};

  for (let i = 0; i < files.length; i++) {
    progresses[files[i]?.folderData?.uploadId] = 0;
  }

  if (files.length) {
    let error = true;
    const multiUploadFile = async (index) => {
      const file = files[index];
      index++;
      try {
        const {
          data: {
            user_token: { token: oneTimeToken },
            gateway
          }
        } = await getOneTimeToken({
          filesize: file.size,
          filename: file.name
        });
        let result;
        const { handlers, callbacks } = uploadFileData;

        const callback = ({ type, params }) => {
          if (handlers.includes(type)) {
            callbacks[type]({ ...params, dispatch });
          } else {
            console.error(`Handler "${type}" isn't provided`);
          }
        };
        const localFileBuffer = new LocalFileBuffer(
          file.size,
          file.name,
          file.type,
          file.folderId,
          file.uploadId,
          async () => file.arrayBuffer()
        );
        result = await uploadFile({
          file: localFileBuffer,
          oneTimeToken,
          gateway,
          callback,
          handlers,
          progress: progresses[file?.folderData?.uploadId],
          totalSize: file?.folderSize,
          startedAt: file?.startedAt,
          is_telegram: true
        });
        const uploadedFile = result.data.data;
        if (
          imageMediaTypesPreview.includes(uploadedFile.mime) &&
          imageFileExtensions.includes(`.${uploadedFile.extension}`)
        ) {
          await getThumbnailImage({
            file,
            quality: 3,
            oneTimeToken,
            endpoint: gateway.url,
            slug: uploadedFile?.slug
          });
        }
        dispatch(afterFileUploadAction(result.data));

        if (!result) {
          console.log('error', error);
        }

        if (index < files.length) await multiUploadFile(index);
        if (file?.folderData) {
          progresses[file?.folderData?.uploadId] += file.size;
        }
      } catch (e) {
        console.log('error', e);
        if (e?.response?.data?.errors === 'Not enough free space') {
          toast.error(
            'The file you are trying to upload exceeds the available free space on your drive. Please free up some storage and try again.',
            {
              theme: 'colored',
              position: 'bottom-center',
              autoClose: 5000
            }
          );
        } else {
          toast.error('Sorry, something went wrong! Please reload the page', {
            theme: 'colored',
            position: 'bottom-center',
            autoClose: 5000
          });
        }
      }
    };

    await multiUploadFile(0);
  }
};
