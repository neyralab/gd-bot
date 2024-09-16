import React, { useEffect, useRef, useState } from 'react';
import { downloadFile } from 'gdgateway-client';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getPreviewFileType } from '../../../../../utils/preview';
import { sendFileViewStatistic } from '../../../../../effects/file/statisticEfect';
import { getFileCids } from '../../../../../effects/file/getFileCid';
import {
  createStreamEffect,
  getDownloadOTT,
  getFilePreviewEffect
} from '../../../../../effects/filesEffects';
import { useMediaSliderCache } from '../MediaSliderCache';
import PreviewSwitcher from '../../../../../components/file-previews/PreviewSwitcher/PreviewSwitcher';
import {
  setFileInfoModal,
  toggleFileFavorite
} from '../../../../../store/reducers/driveSlice';

const USE_STREAM_URL = ['audio', 'video'];
const USE_PREVIEW_IMG = ['audio'];

const FilePreviewController = ({ file, onExpand }) => {
  const dispatch = useDispatch();
  const { getCache, setCacheItem } = useMediaSliderCache();
  const mediaSliderCurrentFile = useSelector(
    (state) => state.drive.mediaSlider.currentFile
  );
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState(null);
  const [filePreviewImage, setFilePreviewImage] = useState(false);
  const [previewFileType, setPreviewFileType] = useState(null);
  const playablePreview = useRef(null);

  useEffect(() => {
    if (file.slug) {
      getContent();
    }
  }, [file.slug]);

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
  }, [fileContent, file.id, loading, mediaSliderCurrentFile.id]);

  const getContent = async () => {
    setLoading(true);
    setFileContent(null);
    setPreviewFileType(null);

    const fileType = getPreviewFileType(file, false, true);
    setPreviewFileType(fileType);

    if (!fileContent && fileType) {
      if (USE_STREAM_URL.includes(fileType)) {
        fetchStreamContent(fileType);
      } else {
        fetchBlobContent(fileType);
      }
    }
  };

  const checkFileCache = () => {
    const cache = getCache(file.id);
    if (cache) {
      setFileContent(cache.content);
      setFilePreviewImage(cache.preview);
      setLoading(false);
    }
    return cache;
  };

  const fetchBlobContent = async (fileType) => {
    const cache = checkFileCache();
    if (cache) return;

    setLoading(true);

    const promises = [
      sendFileViewStatistic(file.slug),
      getFileCids({ slug: file.slug }),
      getDownloadOTT([{ slug: file.slug }])
    ];
    if (USE_PREVIEW_IMG.includes(fileType)) {
      promises.push(getFilePreviewEffect(file.slug, null, file.extension));
    }

    try {
      const [_, cidData, downloadOTTResponse, preview] =
        await Promise.all(promises);

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
        setCacheItem(file.id, realBlob, preview);
        setFileContent(realBlob);
        setFilePreviewImage(preview || null);
        setPreviewFileType(getPreviewFileType(file, realBlob));
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      setFileContent(null);
      setFilePreviewImage(null);
      setPreviewFileType(null);
      toast.error('Sorry, something went wrong. Please try again later');
    }
  };

  const fetchStreamContent = async (fileType) => {
    const cache = checkFileCache();
    if (cache) return;

    setLoading(true);

    const promises = [createStreamEffect(file.slug)];
    if (USE_PREVIEW_IMG.includes(fileType)) {
      promises.push(getFilePreviewEffect(file.slug, null, file.extension));
    }

    try {
      const [streamData, preview] = await Promise.all(promises);
      setCacheItem(file.id, streamData, preview);
      setFileContent(streamData);
      setFilePreviewImage(preview || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setFileContent(null);
      setFilePreviewImage(null);
      setPreviewFileType(null);
      toast.error('Sorry, something went wrong. Please try again later');
    }
  };

  const onFavoriteClick = (file) => {
    dispatch(toggleFileFavorite({ slug: file.slug }));
  };

  const onInfoClick = (file) => {
    dispatch(setFileInfoModal(file));
  };

  return (
    <PreviewSwitcher
      ref={playablePreview}
      loading={loading}
      previewFileType={previewFileType}
      file={file}
      fileContent={fileContent}
      filePreviewImage={filePreviewImage}
      onFavoriteClick={onFavoriteClick}
      onInfoClick={onInfoClick}
      onExpand={onExpand}
    />
  );
};

export default FilePreviewController;
