import { useState } from 'react';
import { getPreviewFileType } from '../../../utils/preview';
import ImagePreview from './imagePreview';
import AudioPreview from '../components/AudioPreview';
import DefaultPreview from './defaultPreview';

const PreviewContent = ({ fileContent, file, wrapper }) => {
  const [previewFileType, setPreviewFileType] = useState(
    getPreviewFileType(file, fileContent)
  );

  switch (previewFileType) {
    case 'img':
      return <ImagePreview file={file} fileContent={fileContent} />;
    case 'audio':
      return <AudioPreview wrapper={wrapper} file={file} />;
    default:
      return <DefaultPreview file={file} />;
  }
};

export default PreviewContent;
