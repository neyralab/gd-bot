import React from 'react';
import DefaultFileTitle from '../DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../DefaultFileActions/DefaultFileActions';

export default function DefaultModeFileUI({
  file,
  onFavoriteClick,
  onInfoClick
}) {
  return (
    <>
      <DefaultFileTitle file={file} />
      <DefaultFileActions
        file={file}
        onFavoriteClick={onFavoriteClick}
        onInfoClick={onInfoClick}
      />
    </>
  );
}
