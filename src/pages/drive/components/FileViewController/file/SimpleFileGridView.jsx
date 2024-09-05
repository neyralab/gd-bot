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
    <li className={styles.fileSquare} id={file.id}>
      <div className={styles['open-action-trigger']} onClick={onFileOpenClick}>
        <div className={styles.previewWrapper}>
          {preview ? (
            <img
              src={preview}
              alt={file.name}
              className={styles.previewImage}
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

        <div className={styles.squareInfo}>
          <p className={styles.squareInfo__name}>
            {isSearchFile ? file.title : file.name}
          </p>
          <p className={styles.squareInfo__date}>
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
