import React, { useEffect, useState } from 'react';
import { downloadFile } from 'gdgateway-client';
import { getPreviewFileType } from '../../../../../utils/preview';
import { sendFileViewStatistic } from '../../../../../effects/file/statisticEfect';
import { getFileCids } from '../../../../../effects/file/getFileCid';
import { getDownloadOTT } from '../../../../../effects/filesEffects';
import AudioPreview from '../../../../../components/filePreviewModal/components/AudioPreview';
import ImagePreview from '../../../../../components/filePreviewModal/previewContent/imagePreview';
import VideoPreview from '../../../../../components/filePreviewModal/previewContent/VideoPreview';
import PdfPreview from '../../../../../components/filePreviewModal/previewContent/PdfPreview';
import ExcelPreview from '../../../../../components/filePreviewModal/previewContent/ExcelPreview';
import TxtPreview from '../../../../../components/filePreviewModal/previewContent/TxtPreview';
import DefaultPreview from '../../../../../components/filePreviewModal/previewContent/defaultPreview';
import Loader2 from '../../../../../components/Loader2/Loader2';
import { useMediaSliderCache } from '../MediaSliderCache';

const ESCAPE_CONTENT_DOWNLOAD = ['audio', 'encrypt'];

const FilePreviewController = ({ file }) => {
  const { getCache, setCacheItem } = useMediaSliderCache();
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);

  useEffect(() => {
    if (file?.slug) {
      setFileContent(null);
      setPreviewFileType(null);
      setLoading(true);

      const canPreview = getPreviewFileType(file, '   ');
      if (canPreview && !ESCAPE_CONTENT_DOWNLOAD.includes(canPreview)) {
        getContent();
      } else {
        setLoading(false);
      }
    }
  }, [file?.slug]);

  const getContent = async () => {
    const hasCache = getCache(file.id);

    if (hasCache) {
      setFileContent(hasCache);
      setPreviewFileType(getPreviewFileType(file, hasCache));
      setLoading(false);
      return;
    }

    try {
      const [_, cidData, downloadOTTResponse] = await Promise.all([
        sendFileViewStatistic(file.slug),
        getFileCids({ slug: file.slug }),
        getDownloadOTT([{ slug: file.slug }])
      ]);

      const {
        data: {
          jwt_ott,
          user_tokens: { token: oneTimeToken },
          gateway,
          upload_chunk_size
        }
      } = downloadOTTResponse;

      const blob = await downloadFile({
        file,
        oneTimeToken,
        endpoint: gateway.url,
        isEncrypted: false,
        uploadChunkSize:
          upload_chunk_size[file.slug] || gateway.upload_chunk_size,
        cidData,
        jwtOneTimeToken: jwt_ott
      });

      if (blob) {
        const realBlob = new Blob([blob]);
        const url = URL.createObjectURL(realBlob);
        setCacheItem(file.id, url);

        if (file.extension === 'svg' || file.extension === 'txt') {
          const text = await realBlob.text();
          setFileContent(text);
          setPreviewFileType(getPreviewFileType(file, text));
          setLoading(false);
          return;
        } else if (
          file.extension === 'pdf' ||
          file.extension === 'xls' ||
          file.extension === 'xlsx'
        ) {
          setFileContent(realBlob);
          setPreviewFileType(getPreviewFileType(file, realBlob));
          setLoading(false);
          return;
        }

        setFileContent(url);
        setPreviewFileType(getPreviewFileType(file, url));
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      setFileContent(null);
      setPreviewFileType(null);
      console.warn(error);
    }
  };

  if (loading) return <Loader2 />;

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

export default FilePreviewController;
