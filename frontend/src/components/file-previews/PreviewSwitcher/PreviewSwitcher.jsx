import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import LoadingPreview from '../LoadingPreview/LoadingPreview';
import ImagePreview from '../ImagePreview/ImagePreview';
import VideoPreview from '../VideoPreview/VideoPreview';
import AudioPreview from '../AudioPreview/AudioPreview';
import TxtPreview from '../TxtPreview/TxtPreview';
import PdfPreview from '../PdfPreview/PdfPreview';
import ExcelPreview from '../ExcelPreview/ExcelPreview';
import DocPreview from '../DocPreview/DocPreview';
import DefaultPreview from '../DefaultPreview/DefaultPreview';
import { isBlobType } from '../../../utils/gateway';

const PreviewSwitcher = forwardRef(
  (
    {
      mode = 'default',
      loading,
      previewFileType,
      file,
      fileContent,
      filePreviewImage,
      onFavoriteClick,
      onInfoClick,
      onExpand,
      disableSwipeEvents
    },
    ref
  ) => {
    const playerRef = useRef(null);
    const [readError, setReadError] = useState(false);

    useImperativeHandle(ref, () => ({
      runPreview: () => {
        if (playerRef.current) {
          playerRef.current.runPreview();
        }
      },
      stopPreview: () => {
        if (playerRef.current) {
          playerRef.current.stopPreview();
        }
      }
    }));

    const onFileReadError = useCallback(() => {
      setReadError(true);
    }, []);

    if (loading) {
      return (
        <LoadingPreview
          mode={mode}
          file={file}
          onFavoriteClick={onFavoriteClick}
          onInfoClick={onInfoClick}
        />
      );
    }

    if (readError) {
      return (
        <DefaultPreview
          mode={mode}
          file={file}
          onFavoriteClick={onFavoriteClick}
          onInfoClick={onInfoClick}
        />
      );
    }
    const contentType = isBlobType(fileContent) ? 'blob' : 'url';

    switch (previewFileType) {
      case 'img':
        return (
          <ImagePreview
            mode={mode}
            file={file}
            fileContent={fileContent}
            fileContentType="blob"
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            onFileReadError={onFileReadError}
          />
        );

      case 'video':
        return (
          <VideoPreview
            mode={mode}
            ref={playerRef}
            file={file}
            fileContent={fileContent}
            fileContentType={contentType}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            disableSwipeEvents={disableSwipeEvents}
            onFileReadError={onFileReadError}
          />
        );

      case 'audio':
        return (
          <AudioPreview
            mode={mode}
            ref={playerRef}
            file={file}
            fileContent={fileContent}
            fileContentType={contentType}
            filePreviewImage={filePreviewImage}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            disableSwipeEvents={disableSwipeEvents}
            onFileReadError={onFileReadError}
          />
        );

      case 'txt':
        return (
          <TxtPreview
            mode={mode}
            file={file}
            fileContent={fileContent}
            fileContentType="blob"
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            onExpand={onExpand}
            onFileReadError={onFileReadError}
          />
        );

      case 'pdf':
        return (
          <PdfPreview
            mode={mode}
            file={file}
            fileContent={fileContent}
            fileContentType="blob"
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            onFileReadError={onFileReadError}
          />
        );

      case 'xlsx':
        return (
          <ExcelPreview
            mode={mode}
            file={file}
            fileContent={fileContent}
            fileContentType="blob"
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            onExpand={onExpand}
            onFileReadError={onFileReadError}
          />
        );

      case 'document':
        return (
          <DocPreview
            mode={mode}
            file={file}
            fileContent={fileContent}
            fileContentType="blob"
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            onExpand={onExpand}
            onFileReadError={onFileReadError}
          />
        );

      default:
        return (
          <DefaultPreview
            mode={mode}
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        );
    }
  }
);

export default PreviewSwitcher;
