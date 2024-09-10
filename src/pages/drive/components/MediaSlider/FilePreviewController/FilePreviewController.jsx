import React, { useEffect, useState } from 'react';
import { downloadFile } from 'gdgateway-client';
import { useSelector } from 'react-redux';
import { getPreviewFileType } from '../../../../../utils/preview';
import { sendFileViewStatistic } from '../../../../../effects/file/statisticEfect';
import { getFileCids } from '../../../../../effects/file/getFileCid';
import { getDownloadOTT } from '../../../../../effects/filesEffects';
import { useMediaSliderCache } from '../MediaSliderCache';
import GhostLoader from '../../../../../components/ghostLoader';
import DefaultPreview from '../../../../../components/file-previews/DefaultPreview/DefaultPreview';
import ImagePreview from '../../../../../components/file-previews/ImagePreview/ImagePreview';
// import AudioPreview from '../../../../../components/filePreviewModal/components/AudioPreview';
// import VideoPreview from '../../../../../components/filePreviewModal/previewContent/VideoPreview';
// import PdfPreview from '../../../../../components/filePreviewModal/previewContent/PdfPreview';
// import ExcelPreview from '../../../../../components/filePreviewModal/previewContent/ExcelPreview';
// import TxtPreview from '../../../../../components/filePreviewModal/previewContent/TxtPreview';
import styles from './FilePreviewController.module.scss';

const ESCAPE_CONTENT_DOWNLOAD = ['audio', 'encrypt'];

const FilePreviewController = ({ file }) => {
  const { getCache, setCacheItem } = useMediaSliderCache();
  const mediaSliderFileContentTurn = useSelector(
    (state) => state.drive.mediaSliderFileContentTurn
  );
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);

  useEffect(() => {
    getContent();
  }, [file.slug]);

  useEffect(() => {
    /** Upload content only if it's the files turn */
    if (mediaSliderFileContentTurn === file.id && !fileContent) {
      fetchContent();
    }
  }, [mediaSliderFileContentTurn]);

  const getContent = () => {
    setLoading(true);
    setFileContent(null);
    setPreviewFileType(null);

    const canPreview = getPreviewFileType(file, '   ');
    if (canPreview && !ESCAPE_CONTENT_DOWNLOAD.includes(canPreview)) {
      const cache = getCache(file.id);

      if (cache) {
        setFileContent(cache);
        setPreviewFileType(getPreviewFileType(file, cache));
        setLoading(false);
      }
    }
  };

  const fetchContent = async () => {
    setLoading(true);

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

  if (loading) {
    return (
      <div className={styles['default-loader']}>
        <GhostLoader />
      </div>
    );
  }

  switch (previewFileType) {
    case 'img':
      return <ImagePreview file={file} fileContent={fileContent} />;
    // case 'audio':
    //   return <AudioPreview wrapper={wrapper} file={file} />;
    // case 'video':
    //   return <VideoPreview file={file} fileContent={fileContent} />;
    // case 'pdf':
    //   return <PdfPreview file={file} fileContent={fileContent} />;
    // case 'xlsx':
    //   return <ExcelPreview file={file} fileContent={fileContent} />;
    // case 'txt':
    //   return <TxtPreview fileContent={fileContent} />;
    default:
      return <DefaultPreview file={file} />;
  }
};

export default FilePreviewController;
