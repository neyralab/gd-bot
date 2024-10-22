import React from 'react';
import CustomFolderIcon from '../../../../../components/customFileIcon/CustomFolderIcon';
import FavoriteButton from '../buttons/FavoriteButton';
import CustomFileSmallIcon from '../../../../../components/customFileIcon/CustomFileSmallIcon';
import MenuButton from '../buttons/MenuButton';
import styles from './file.module.scss';

export default function SimpleFileListView({
  file,
  viewType,
  isFolder,
  preview,
  isFavorite,
  isSearchFile,
  formattedDate,
  onFavoriteClick,
  onMenuClick,
  onFileOpenClick
}) {
  return (
    <li className={styles['container--list']}>
      <div className={styles['open-action-trigger']} onClick={onFileOpenClick}>
        <div className={styles['preview-wrapper--list']}>
          {preview ? (
            <img
              src={preview}
              alt="file"
              width={30}
              height={40}
              className={styles['preview-image']}
            />
          ) : isFolder ? (
            <CustomFolderIcon viewType={viewType} color={file?.color[0]?.hex} />
          ) : (
            <CustomFileSmallIcon type={file.extension} />
          )}
        </div>

        <div className={styles['info--list']}>
          <h3 className={styles[['info-name--list']]}>
            {isSearchFile ? file.title : file.name}
          </h3>

          <p className={styles['info-date--list']}>
            {isSearchFile ? file.updated : formattedDate}
          </p>
        </div>
      </div>

      <FavoriteButton
        viewType={viewType}
        isFavorite={isFavorite}
        onFavoriteClick={onFavoriteClick}
        slug={file.slug}
      />
      <MenuButton onMenuClick={onMenuClick} />
    </li>
  );
}
