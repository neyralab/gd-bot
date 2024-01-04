import moment from 'moment';
import { uploadFile, LocalFileBuffer } from 'gdgateway-client/lib/es5';

import { getOneTimeToken } from '../../effects/getOneTimeToken';
import { uploadFileData } from '../../config/upload-file-data';
import { setFiles } from '../../store/reducers/filesSlice';

const formattedDate = (dateCreated) =>
  moment.unix(dateCreated).format('MMM DD, YYYY, h:mma');

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
            gateway,
          },
        } = await getOneTimeToken({
          filesize: file.size,
          filename: file.name,
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
          file.mime,
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
        });
        const uploadedFile = result.data.data;
        uploadedFile.created_at = formattedDate(uploadedFile.created_at);

        dispatch(setFiles(uploadedFile));

        if (!result) {
          console.log('error', error);
        }

        if (index < files.length) await multiUploadFile(index);
        if (file?.folderData) {
          progresses[file?.folderData?.uploadId] += file.size;
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    await multiUploadFile(0);
  }
};
