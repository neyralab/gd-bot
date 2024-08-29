import { useState } from 'react';
import { getPreviewFileType } from '../../../utils/preview';
import ImagePreview from './imagePreview';
import AudioPreview from '../components/AudioPreview';
import DefaultPreview from './defaultPreview';
import VideoPreview from './VideoPreview';
import PdfPreview from './PdfPreview';
import ExcelPreview from './ExcelPreview';
import TxtPreview from './TxtPreview';

const PreviewContent = ({ fileContent, file, wrapper }) => {
  const [previewFileType, setPreviewFileType] = useState(
    getPreviewFileType(file, fileContent)
  );

  switch (previewFileType) {
    case 'img':
      return <ImagePreview file={file} fileContent={fileContent} />;
    case 'audio':
      return <AudioPreview wrapper={wrapper} file={file} />;
    case 'video':
      return <VideoPreview file={file} fileContent={fileContent} />;
    case 'pdf':
      return <PdfPreview file={file} fileContent={fileContent} />;
    case 'xlsx':
      return <ExcelPreview file={file} fileContent={fileContent} />;
    case 'txt':
      return <TxtPreview fileContent={fileContent} />;
    default:
      return <DefaultPreview file={file} />;
  }
};

export default PreviewContent;
