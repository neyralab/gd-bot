import React from 'react';
import MenuButton from '../buttons/MenuButton';
import StarButton from '../buttons/StarButton';
import CustomFolderIcon from '../../../../../components/customFileIcon/CustomFolderIcon';
import { ReactComponent as StarIcon } from '../../../../../assets/star.svg';
import { ReactComponent as EyeIcon } from '../../../../../assets/eye.svg';
import CustomFileSmallIcon from '../../../../../components/customFileIcon/CustomFileSmallIcon';
import styles from './file.module.scss';

export default function PPVFileListView({
  file,
  viewType,
  isFolder,
  preview,
  isSearchFile,
  onMenuClick,
  onFileOpenClick
}) {
  return (
    <li className={styles['container--list']} id={file.id}>
      <div className={styles['open-action-trigger']} onClick={onFileOpenClick}>
        <div className={styles['preview-wrapper--list']}>
          {preview ? (
            <img
              src={preview}
              alt={file.name}
              className={styles['preview-image']}
              width={30}
              height={40}
            />
          ) : isFolder ? (
            <CustomFolderIcon viewType={viewType} color={file?.color[0]?.hex} />
          ) : (
            <CustomFileSmallIcon type={file.extension} />
          )}
        </div>

        <div className={styles['info--list']}>
          <p className={styles['info-name--list']}>
            {isSearchFile ? file.title : file.name}
          </p>

          <div className={styles['info-statistics--list']}>
            <p className={styles['info-statistics-item--list']}>
              <StarIcon width="12" height="12" viewBox="0 0 21 20" />
              <span>{file?.share_file?.price_view || 0}</span>
            </p>

            <p className={styles['info-statistics-item--list']}>
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
