import { useState } from 'react';
import { getPreviewFileType } from '../../../utils/preview';
import ImagePreview from './imagePreview';
import DefaultPreview from './defaultPreview';

const PreviewContent = ({ fileContent, file }) => {
  const [previewFileType, setPreviewFileType] = useState(
    getPreviewFileType(file, fileContent)
  );

  switch (previewFileType) {
    case 'img':
      return <ImagePreview file={file} fileContent={fileContent} />;
    default:
      return <DefaultPreview file={file} />;
  }
};

export default PreviewContent;
