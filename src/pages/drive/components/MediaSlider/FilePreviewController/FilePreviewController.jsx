import React, { useEffect, useRef, useState } from 'react';
import { downloadFile } from 'gdgateway-client';
import { useSelector } from 'react-redux';
import { getPreviewFileType } from '../../../../../utils/preview';
import { sendFileViewStatistic } from '../../../../../effects/file/statisticEfect';
import { getFileCids } from '../../../../../effects/file/getFileCid';
import { getDownloadOTT } from '../../../../../effects/filesEffects';
import { useMediaSliderCache } from '../MediaSliderCache';
import LoadingPreview from '../../../../../components/file-previews/LoadingPreview/LoadingPreview';
import DefaultPreview from '../../../../../components/file-previews/DefaultPreview/DefaultPreview';
import ImagePreview from '../../../../../components/file-previews/ImagePreview/ImagePreview';
import TxtPreview from '../../../../../components/file-previews/TxtPreview/TxtPreview';
import PdfPreview from '../../../../../components/file-previews/PdfPreview/PdfPreview';
import VideoPreview from '../../../../../components/file-previews/VideoPreview/VideoPreview';
import ExcelPreview from '../../../../../components/file-previews/ExcelPreview/ExcelPreview';
import AudioPreview from '../../../../../components/file-previews/AudioPreview/AudioPreview';

const ESCAPE_CONTENT_DOWNLOAD = ['audio', 'encrypt'];

const FilePreviewController = ({ file }) => {
  const { getCache, setCacheItem } = useMediaSliderCache();
  const mediaSliderFileContentTurn = useSelector(
    (state) => state.drive.mediaSliderFileContentTurn
  );
  const mediaSliderCurrentFile = useSelector(
    (state) => state.drive.mediaSlider.currentFile
  );
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState(null);
  const [previewFileType, setPreviewFileType] = useState(null);
  const playablePreview = useRef(null);

  useEffect(() => {
    getContent();
  }, [file.slug]);

  useEffect(() => {
    /** Upload content only if it's the files turn
     * AND the content should/can be downloaded (streams should not)
     */
    if (
      mediaSliderFileContentTurn === file.id &&
      !fileContent &&
      previewFileType &&
      !ESCAPE_CONTENT_DOWNLOAD.includes(previewFileType)
    ) {
      fetchContent();
    }
  }, [mediaSliderFileContentTurn, previewFileType]);

  useEffect(() => {
    if (
      previewFileType &&
      !loading &&
      mediaSliderCurrentFile &&
      mediaSliderCurrentFile.id === file.id
    ) {
      playablePreview?.current?.runPreview();
    } else {
      playablePreview?.current?.stopPreview();
    }
  }, [fileContent, file.id, loading, mediaSliderCurrentFile]);

  const getContent = () => {
    /** Pay attention, that this function DOES NOT fetch content of the file
     * It tries to get it from cache
     * Fetching content happens when it's the turn to get the content for a particular file.
     * This logic is needed for slider to work better.
     */
    setLoading(true);
    setFileContent(null);
    setPreviewFileType(null);

    const fileType = getPreviewFileType(file, false, true);
    setPreviewFileType(fileType);
    if (fileType && !ESCAPE_CONTENT_DOWNLOAD.includes(fileType)) {
      const cache = getCache(file.id);

      if (cache) {
        setFileContent(cache);
        setPreviewFileType(getPreviewFileType(file, cache));
        setLoading(false);
      }
    } else {
      setLoading(false);
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
        setCacheItem(file.id, realBlob);

        if (file.extension === 'svg' || file.extension === 'txt') {
          const text = await realBlob.text();
          setFileContent(realBlob);
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

        setFileContent(realBlob);
        setPreviewFileType(getPreviewFileType(file, realBlob));
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
    return <LoadingPreview file={file} />;
  }

  switch (previewFileType) {
    case 'img':
      return <ImagePreview file={file} fileContent={fileContent} />;

    case 'video':
      return (
        <VideoPreview
          ref={playablePreview}
          file={file}
          fileContent={fileContent}
        />
      );

    case 'audio':
      return <AudioPreview ref={playablePreview} file={file} />;

    case 'txt':
      return <TxtPreview file={file} fileContent={fileContent} />;

    case 'pdf':
      return <PdfPreview file={file} fileContent={fileContent} />;

    case 'xlsx':
      return <ExcelPreview file={file} fileContent={fileContent} />;

    default:
      return <DefaultPreview file={file} />;
  }
};

export default FilePreviewController;
