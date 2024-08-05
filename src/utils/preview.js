import {
  imageMediaTypes,
  imagesWithoutPreview
} from '../config/image-file-extensions';
import audioFilesExtensions, {
  audioMediaTypes,
  audioMediaTypesContent
} from '../config/audio-file-extensions';
import {
  videoMediaExtentionPreview,
  videoWithoutPreview
} from '../config/video-file-extensions';
import {
  docMediaTypesContent,
  docMediaWithoutPreview,
  pdfMediaTypes
} from '../config/docs-file-extensions';

const getPreviewFileType = (file, entityContent) => {
  let entityFileType = '';

  if (file?.is_clientside_encrypted) entityFileType = 'encrypt';
  else {
    if (videoMediaExtentionPreview.includes(file.extension) && !entityContent) {
      entityFileType = 'video';
    }
    if (file.mime && entityContent) {
      if (videoMediaExtentionPreview.includes(file.extension)) {
        entityFileType = 'video';
        if (videoWithoutPreview.includes(file.extension)) {
          entityFileType = '';
        }
      } else if (audioMediaTypes.includes(file.mime)) {
        entityFileType = 'audio';
      } else if (audioFilesExtensions.includes(`.${file.extension}`)) {
        entityContent = '';
      } else if (file.mime === 'application/pdf') {
        entityFileType = 'pdf';
      } else if (
        docMediaTypesContent.includes(file.mime) ||
        docMediaWithoutPreview.includes(file.extension)
      ) {
        entityFileType = 'document';
        if (docMediaWithoutPreview.includes(file.extension)) {
          entityFileType = '';
        }
      } else if (imageMediaTypes.includes(file.mime)) {
        if (imagesWithoutPreview.includes(`.${file.extension}`)) {
          entityContent = '';
        } else {
          entityFileType = 'img';
        }
      } else if (file.extension === 'xlsx' || file.extension === 'xls') {
        entityFileType = 'xlsx';
      } else if (file.mime === 'text/plain') {
        entityFileType = 'txt';
      } else {
        entityFileType = '';
      }
    }
  }

  return entityFileType;
};

const previewDownloadNow = (mime) => {
  const res =
    !videoMediaExtentionPreview.includes(mime) &&
    !audioMediaTypesContent.includes(mime) &&
    !docMediaTypesContent.includes(mime) &&
    !pdfMediaTypes.includes(mime);
  return res;
};

export { getPreviewFileType, previewDownloadNow };
