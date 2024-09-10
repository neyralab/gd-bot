import React from 'react';
import DefaultLoader from '../components/DefaultLoader/DefaultLoader';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';

export default function LoadingPreview({ file }) {
  return (
    <>
      <DefaultLoader />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </>
  );
}
