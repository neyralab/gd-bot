import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPreviewFileType } from '../../../../../utils/preview';
import {
  getFilecoinBlobEffect,
  getFilecoinStreamEffect,
} from '../../../../../effects/filesEffects';
import { useMediaSliderCache } from '../MediaSliderCache';
import PreviewSwitcher from '../../../../../components/file-previews/PreviewSwitcher/PreviewSwitcher';
import {
  setFileInfoModal,
  toggleFileFavorite
} from '../../../../../store/reducers/driveSlice';
import { isDataprepUrl } from '../../../../../utils/gateway';

const USE_STREAM_URL = ['audio', 'video'];
const USE_PREVIEW_IMG = ['audio'];

const FilePreviewController = ({ file, onExpand, disableSwipeEvents }) => {
  const dispatch = useDispatch();
  const { getCache, setCacheItem } = useMediaSliderCache();
  const mediaSliderCurrentFile = useSelector(
    (state) => state.drive.mediaSlider.currentFile
  );
  const user = useSelector((state) => state.user.data);
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
    const isDataprep = isDataprepUrl(user.gateway.url);

    if (!fileContent && fileType) {
      if (USE_STREAM_URL.includes(fileType) && isDataprep) {
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

    const { realBlob, preview } = await getFilecoinBlobEffect({
      file,
      getPreview: USE_PREVIEW_IMG.includes(fileType)
    });

    if (realBlob) {
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

    const { streamData, preview } = await getFilecoinStreamEffect({
      file,
      getPreview: USE_PREVIEW_IMG.includes(fileType)
    });

    if (streamData) {
      setCacheItem(file.id, streamData?.value || null, preview?.value || null);
      setFileContent(streamData?.value || null);
      setFilePreviewImage(preview?.value || null);
    }
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
