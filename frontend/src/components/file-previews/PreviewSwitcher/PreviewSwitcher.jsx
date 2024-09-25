import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import LoadingPreview from '../LoadingPreview/LoadingPreview';
import ImagePreview from '../ImagePreview/ImagePreview';
import VideoPreview from '../VideoPreview/VideoPreview';
import AudioPreview from '../AudioPreview/AudioPreview';
import TxtPreview from '../TxtPreview/TxtPreview';
import PdfPreview from '../PdfPreview/PdfPreview';
import ExcelPreview from '../ExcelPreview/ExcelPreview';
import DefaultPreview from '../DefaultPreview/DefaultPreview';

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
          />
        );

      case 'video':
        return (
          <VideoPreview
            mode={mode}
            ref={playerRef}
            file={file}
            fileContent={fileContent}
            fileContentType="url"
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            disableSwipeEvents={disableSwipeEvents}
          />
        );

      case 'audio':
        return (
          <AudioPreview
            mode={mode}
            ref={playerRef}
            file={file}
            fileContent={fileContent}
            fileContentType="url"
            filePreviewImage={filePreviewImage}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
            disableSwipeEvents={disableSwipeEvents}
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
