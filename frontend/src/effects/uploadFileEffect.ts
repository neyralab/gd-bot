import {
  uploadFile,
  LocalFileBuffer,
  getThumbnailImage,
  getThumbnailVideo
} from 'gdgateway-client';
import { toast } from 'react-toastify';

import { getOneTimeToken } from './getOneTimeToken';
import { uploadFileData } from '../config/upload-file-data';
import { imagesWithoutPreview } from '../config/image-file-extensions';
import { videoWithoutThumbnail } from '../config/video-file-extensions';
import { getResponseError } from '../utils/string';
import { DefaultError } from './types/defaults';

interface UploadFileParams {
  files: FileList;
  dispatch: Function;
  afterFileUploadCallback: (e: any) => void;
  onUploadProgress: (e: any) => void;
  onUploadError: (e: any) => void;
}

export const uploadFileEffect = async ({
  files,
  dispatch,
  afterFileUploadCallback,
  onUploadError
}: UploadFileParams) => {
  if (files.length) {
    let error = true;
    const multiUploadFile = async (index: number) => {
      const file = files[index];

      index++;
      try {
        const {
          data: { user_token, gateway, jwt_ott }
        } = await getOneTimeToken([
          {
            filesize: file.size,
            filename: file.name,
            isPublic: true
          }
        ]);
        const oneTimeToken = user_token[0].token;
        const jwtOneTimeToken = jwt_ott[0];
        let result;
        const { handlers, callbacks } = uploadFileData;

        const callback = ({
          type,
          params
        }: {
          type: string;
          params: Record<string, string>;
        }) => {
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
          '',
          '',
          async () => file.arrayBuffer(),
          () => file.stream()
        );

        result = await uploadFile({
          file: localFileBuffer,
          oneTimeToken,
          gateway,
          callback,
          handlers,
          jwtOneTimeToken
        });

        const uploadedFile = result?.gdGateway
          ? result?.fileInfo
          : result?.data?.data;
        try {
          if (
            uploadedFile?.mime.startsWith('image') &&
            !imagesWithoutPreview.includes(`.${uploadedFile?.extension}`)
          ) {
            await getThumbnailImage({
              file,
              quality: 3,
              oneTimeToken,
              endpoint: gateway.url,
              slug: uploadedFile?.slug,
              jwtOneTimeToken
            });
          } else if (
            uploadedFile?.mime.startsWith('video') &&
            !videoWithoutThumbnail.includes(uploadedFile?.extension)
          ) {
            await getThumbnailVideo({
              file,
              quality: 3,
              oneTimeToken,
              endpoint: gateway.url,
              slug: uploadedFile?.slug,
              jwtOneTimeToken
            });
          }
        } catch (error) {
          console.error(error);
        }

        afterFileUploadCallback?.(result.data);

        if (!result) {
          console.log('error', error);
        }

        if (index < files.length) await multiUploadFile(index);
      } catch (e) {
        console.log('error', e);
        const error = e as DefaultError<string>;
        if (error?.response?.data?.errors === 'Not enough free space') {
          toast.error(
            'The file you are trying to upload exceeds the available free space on your drive. Please free up some storage and try again.',
            {
              theme: 'colored',
              position: 'bottom-center',
              autoClose: 5000
            }
          );
        } else {
          toast.error(getResponseError(e), {
            theme: 'colored',
            position: 'bottom-center',
            autoClose: 5000
          });
        }
        onUploadError?.(e);
      }
    };

    await multiUploadFile(0);
  }
};
