import React, { useEffect, useRef, useState } from 'react';
import { downloadFile } from 'gdgateway-client';
import { useDispatch, useSelector } from 'react-redux';
import { getPreviewFileType } from '../../../../../utils/preview';
import { sendFileViewStatistic } from '../../../../../effects/file/statisticEfect';
import { getFileCids } from '../../../../../effects/file/getFileCid';
import {
  createStreamEffect,
  getDownloadOTT,
  getFilePreviewEffect
} from '../../../../../effects/filesEffects';
// import { useMediaSliderCache } from '../MediaSliderCache';
import PreviewSwitcher from '../../../../../components/file-previews/PreviewSwitcher/PreviewSwitcher';
import {
  setFileInfoModal,
  toggleFileFavorite
} from '../../../../../store/reducers/driveSlice';
import { toast } from 'react-toastify';

const USE_STREAM_URL = ['audio', 'video'];
const USE_PREVIEW_IMG = ['audio'];

const FilePreviewController = ({ file, onExpand }) => {
  const dispatch = useDispatch();
  // const { getCache, setCacheItem } = useMediaSliderCache();
  const mediaSliderCurrentFile = useSelector(
    (state) => state.drive.mediaSlider.currentFile
  );
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState(null);
  const [filePreviewImage, setFilePreviewImage] = useState(false);
  const [filePrevieImageIsLoading, setFilePreviewImageIsLoading] =
    useState(false);
  const [previewFileType, setPreviewFileType] = useState(null);
  const playablePreview = useRef(null);

  useEffect(() => {
    getContent();
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
        fetchStreamContent();
      } else {
        fetchBlobContent();
      }

      if (USE_PREVIEW_IMG.includes(fileType)) {
        fetchPreviewImage();
      }
    }
  };

  const fetchBlobContent = async () => {
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

        setFileContent(realBlob);
        setPreviewFileType(getPreviewFileType(file, realBlob));
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      setFileContent(null);
      setPreviewFileType(null);
      toast.error('Sorry, something went wrong. Please try again later 1');
    }
  };

  const fetchStreamContent = () => {
    setLoading(true);

    createStreamEffect(file.slug)
      .then((data) => {
        setFileContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFileContent(null);
        setPreviewFileType(null);
        toast.error('Sorry, something went wrong. Please try again later 2');
      });
  };

  const fetchPreviewImage = () => {
    setFilePreviewImageIsLoading(true);

    getFilePreviewEffect(file.slug, null, file.extension)
      .then((preview) => {
        setFilePreviewImage(preview);
        setFilePreviewImageIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setFilePreviewImage(null);
        etFilePreviewImageIsLoading(false);
      });
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
      loading={loading || filePrevieImageIsLoading}
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
