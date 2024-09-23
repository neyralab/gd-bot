import React from 'react';
import CustomFolderIcon from '../../../../../components/customFileIcon/CustomFolderIcon';
import CustomFileIcon from '../../../../../components/customFileIcon';
import FavoriteButton from '../buttons/FavoriteButton';
import MenuButton from '../buttons/MenuButton';
import styles from './file.module.scss';

export default function SimpleFileGridView({
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
    <li className={styles['container--grid']} id={file.id}>
      <div className={styles['open-action-trigger']} onClick={onFileOpenClick}>
        <div className={styles['preview-wrapper--grid']}>
          {preview ? (
            <img
              src={preview}
              alt={file.name}
              className={styles['preview-image']}
            />
          ) : isFolder ? (
            <CustomFolderIcon viewType={viewType} color={file?.color[0]?.hex} />
          ) : (
            <CustomFileIcon
              extension={file.extension}
              color={file.color}
              dateCreated={file.created_at}
            />
          )}
        </div>

        <div className={styles['info--grid']}>
          <p className={styles['info-name--grid']}>
            {isSearchFile ? file.title : file.name}
          </p>

          <p className={styles['info-date--grid']}>
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
