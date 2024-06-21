import React, { useMemo } from 'react';

import { ReactComponent as FolderFrontDark } from './assets/folder/folder_front_dark.svg';
import { ReactComponent as FolderBackDark } from './assets/folder/folder_back_dark.svg';
import { ReactComponent as Mark } from './assets/folder/folder_mark.svg';

import defaultIcon from './assets/folder/default.png';
import default_multy from './assets/folder/default_multy.png';
import default_big from './assets/folder/default_big.png';

import classNames from 'classnames';
import style from './style_folder.module.scss';

const defaultImages = [defaultIcon, defaultIcon, defaultIcon];

const CustomFolderIcon = ({
  color = '',
  viewType = 'grid',
  folderEntities = 0,
  folderImages = []
}) => {
  const images = useMemo(() => {
    if (folderEntities === 1 && folderImages.length === 0) {
      return [default_big];
    }
    if (folderEntities > 1 && folderImages.length === 0) {
      return [default_multy];
    }
    return [...folderImages, ...defaultImages].slice(0, 3);
  }, [folderImages.length, folderEntities]);

  const renderFolderContent = () => {
    if (folderEntities > 1 && folderImages.length === 0) {
      return (
        <div
          className={classNames(
            style.folderContent,
            viewType === 'list' && style.smallContent
          )}>
          <img src={default_multy} alt="folder content" />
        </div>
      );
    }

    switch (folderEntities) {
      case 0:
        return <div></div>;
      case 1:
      case 2:
        return (
          <div
            className={classNames(
              style.folderContent,
              viewType === 'list' && style.smallContent
            )}>
            <img src={images[0]} alt="folder content" />
          </div>
        );
      default:
        return (
          <div
            className={classNames(
              style.folderContentGroup,
              viewType === 'list' && style.smallContent
            )}>
            {images.map((image, i) => (
              <img src={image} alt="folder content" key={image + i} />
            ))}
          </div>
        );
    }
  };
  return (
    <div
      className={classNames(
        style.folderWrapper,
        viewType === 'list' && style.smallIcon
      )}>
      <>
        <FolderBackDark />
        {renderFolderContent()}
        <FolderFrontDark />
      </>
      {color && <Mark style={{ fill: color }} />}
    </div>
  );
};

export default CustomFolderIcon;
