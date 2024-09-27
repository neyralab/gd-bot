import React, { useEffect, useRef, useState } from 'react';
import { downloadFile } from 'gdgateway-client';
import { useDispatch, useSelector } from 'react-redux';
import { CarReader } from '@ipld/car';

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

const FilePreviewController = ({ file, onExpand, disableSwipeEvents }) => {
  const dispatch = useDispatch();
  const { getCache, setCacheItem } = useMediaSliderCache();
  const mediaSliderCurrentFile = useSelector(
    (state) => state.drive.mediaSlider.currentFile
  );
  const [loading, setLoading] = useState(true); // leave it loading initially, so there is no extra render flips
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
      fileContent &&
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

    const fileType = getPreviewFileType(file, false, true);
    setPreviewFileType(fileType);

    if (!fileContent && fileType) {
      if (USE_STREAM_URL.includes(fileType)) {
        fetchStreamContent(fileType);
      } else {
        fetchBlobContent(fileType);
      }
    } else {
      setLoading(false);
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

    const promises = [
      sendFileViewStatistic(file.slug),
      getFileCids({ slug: file.slug }),
      getDownloadOTT([{ slug: file.slug }])
    ];
    if (USE_PREVIEW_IMG.includes(fileType)) {
      promises.push(getFilePreviewEffect(file.slug, null, file.extension));
    }

    const [_, cidData, downloadOTTResponse, preview] =
      await Promise.allSettled(promises);

    let blob;

    if (cidData?.value && downloadOTTResponse?.value) {
      const {
        data: {
          jwt_ott,
          user_tokens: { token: oneTimeToken },
          gateway,
          upload_chunk_size
        }
      } = downloadOTTResponse.value;

      blob = await downloadFile({
        file,
        oneTimeToken,
        endpoint: gateway.url,
        isEncrypted: false,
        uploadChunkSize:
          upload_chunk_size[file.slug] || gateway.upload_chunk_size,
        cidData: cidData.value,
        jwtOneTimeToken: jwt_ott,
        carReader: CarReader
      });
    }

    const realBlob = blob ? new Blob([blob]) : null;
    if (blob) {
      setCacheItem(file.id, realBlob, preview?.value || null);
      setFileContent(realBlob);
      setPreviewFileType(realBlob ? getPreviewFileType(file, realBlob) : null);
    }
    setFilePreviewImage(preview?.value || null);
    setLoading(false);
  };

  const fetchStreamContent = async (fileType) => {
    const cache = checkFileCache();
    if (cache) return;

    const promises = [createStreamEffect(file.slug)];
    if (USE_PREVIEW_IMG.includes(fileType)) {
      promises.push(getFilePreviewEffect(file.slug, null, file.extension));
    }

    const [streamData, preview] = await Promise.allSettled(promises);
    setCacheItem(file.id, streamData?.value || null, preview?.value || null);
    setFileContent(streamData?.value || null);
    setFilePreviewImage(preview?.value || null);
    setLoading(false);
    if (!streamData || !streamData.value) {
      setPreviewFileType(null);
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
      disableSwipeEvents={disableSwipeEvents}
    />
  );
};

export default FilePreviewController;
