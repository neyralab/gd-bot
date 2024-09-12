import React from 'react';
import DefaultLoader from '../components/DefaultLoader/DefaultLoader';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';

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
        <>
          <DefaultFileTitle file={file} />
          <DefaultFileActions
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        </>
      )}
    </>
  );
}
