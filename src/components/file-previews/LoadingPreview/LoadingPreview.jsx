import React from 'react';
import DefaultLoader from '../components/DefaultLoader/DefaultLoader';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';

export default function LoadingPreview({
  mode = 'default',
  file,
  onFavoriteClick,
  onInfoClick
}) {
  return (
    <>
      <DefaultLoader />

      {mode === 'default' && (
        <DefaultModeFileUI
          file={file}
          onFavoriteClick={onFavoriteClick}
          onInfoClick={onInfoClick}
        />
      )}
    </>
  );
}
