import {
  imageMediaTypes,
  imagesWithoutPreview
} from '../config/image-file-extensions';
import audioFilesExtensions, {
  audioMediaTypes,
  audioMediaTypesContent,
  audioWithoutPreview,
  audioWithoutPreviewIOS,
  audioWithoutPreviewOther
} from '../config/audio-file-extensions';
import {
  videoMediaExtentionPreview,
  videoWithoutPreview,
  videoWithoutPreviewIOS,
  videoWithoutPreviewOther
} from '../config/video-file-extensions';
import {
  docMediaTypesContent,
  docMediaWithoutPreview,
  pdfMediaTypes
} from '../config/docs-file-extensions';
import { isiOS } from './client';


const getPreviewFileType = (file, entityContent, withoutContent) => {
  let entityFileType = '';

  if (file?.is_clientside_encrypted) {
    entityFileType = 'encrypt';
  } else {
    if (videoMediaExtentionPreview.includes(file.extension) && !entityContent) {
      entityFileType = 'video';
    }
    if (file.mime && (entityContent || withoutContent)) {
      if (
        videoMediaExtentionPreview.includes(file.extension) &&
        !videoWithoutPreview.includes(file.extension) &&
        !(isiOS() && videoWithoutPreviewIOS.includes(file.extension)) &&
        !(!isiOS() && videoWithoutPreviewOther.includes(file.extension))
      ) {
        entityFileType = 'video';
      } else if (audioMediaTypes.includes(file.mime)) {
        entityFileType = 'audio';
      } else if (
        audioFilesExtensions.includes(`.${file.extension}`) ||
        audioWithoutPreview.includes(`.${file.extension}`) ||
        (isiOS() && audioWithoutPreviewIOS.includes(`.${file.extension}`)) ||
        (!isiOS() && audioWithoutPreviewOther.includes(`.${file.extension}`))
      ) {
        entityFileType = '';
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
    } else if (file.mime && audioMediaTypes.includes(file.mime)) {
      entityFileType = 'audio';
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
