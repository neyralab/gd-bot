import React from 'react';
import MenuButton from '../buttons/MenuButton';
import StarButton from '../buttons/StarButton';
import CustomFolderIcon from '../../../../../components/customFileIcon/CustomFolderIcon';
import CustomFileIcon from '../../../../../components/customFileIcon';
import { ReactComponent as StarIcon } from '../../../../../assets/star.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/eye.svg';
import styles from './file.module.scss';

export default function PPVFileGridView({
  file,
  viewType,
  isFolder,
  preview,
  isSearchFile,
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
            <CustomFolderIcon viewType={view} color={file?.color[0]?.hex} />
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

          <div className={styles['info-statistics--grid']}>
            <p className={styles['info-statistics-item--grid']}>
              <StarIcon width="12" height="12" viewBox="0 0 21 20" />
              <span>{file?.share_file?.price_view || 0}</span>
            </p>
            
            <p className={styles['info-statistics-item--grid']}>
              <EyeIcon />
              <span>{file?.entry_statistic?.viewed || 0}</span>
            </p>
          </div>
        </div>
      </div>

      <StarButton viewType={viewType} />
      <MenuButton onMenuClick={onMenuClick} />
    </li>
  );
}
