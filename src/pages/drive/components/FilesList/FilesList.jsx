import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as GridIcon } from '../../../../assets/grid_view.svg';
import { ReactComponent as ListIcon } from '../../../../assets/list_view.svg';
import { ReactComponent as FileIcon } from '../../../../assets/file_draft.svg';
import { vibrate } from '../../../../utils/vibration';
import {
  assignFilesQueryData,
  getDriveFiles,
  setViewType
} from '../../../../store/reducers/driveSlice';
import GhostLoader from '../../../../components/ghostLoader';
import FileViewController from '../FileViewController/FileViewController';
import LoaderRow from './LoaderRow/LoaderRow';
import { runItemsAnimation } from './animations';
import styles from './FilesList.module.scss';

export default function FilesList() {
  const { t } = useTranslation('drive');
  const dispatch = useDispatch();
  const viewType = useSelector((state) => state.drive.viewType);
  const queryData = useSelector((state) => state.drive.filesQueryData);
  const files = useSelector((state) => state.drive.files);
  const areFilesLoading = useSelector((state) => state.drive.areFilesLoading);
  const areFilesLazyLoading = useSelector(
    (state) => state.drive.areFilesLazyLoading
  );
  const totalPages = useSelector((state) => state.drive.totalPages);
  const [mode, setMode] = useState(null); // null | 'search' | 'category'
  const highestAnimatedIndex = useRef(-1);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!!queryData.search) {
      setMode('search');
    } else if (!!queryData.category) {
      setMode('category');
    } else {
      setMode(null);
    }
  }, [queryData]);

  useEffect(() => {
    if (mode) {
      if (!areFilesLazyLoading && !areFilesLoading) {
        dispatch(getDriveFiles({ mode: 'replace', page: 1 }));
        dispatch(assignFilesQueryData({ filesQueryData: { page: 1 } }));
        if (highestAnimatedIndex.current) {
          highestAnimatedIndex.current = -1; // refresh animation start number
        }
      }
    }
  }, [mode]);

  useEffect(() => {
    /** Run appear animation again */
    if (highestAnimatedIndex.current) {
      highestAnimatedIndex.current = -1;
      runItemsAnimation(0, files.length - 1, highestAnimatedIndex);

      /** Scroll to top, because if you loaded 100500 files,
       * you won't see anything, until animation reaches your scroll position */
      if (scrollRef.current) {
        const scrollableNode = scrollRef.current.getScrollableTarget();
        if (scrollableNode) {
          scrollableNode.scrollTop = 0;
        }
      }
    }
  }, [viewType]);

  useEffect(() => {
    runItemsAnimation(0, files.length - 1, highestAnimatedIndex);
  }, [files]);

  const viewTypeChange = () => {
    vibrate();
    dispatch(setViewType(viewType === 'grid' ? 'list' : 'grid'));
  };

  const hasMoreItemsToLoad = () => {
    return queryData.page < totalPages;
  };

  const loadMoreItems = () => {
    if (!areFilesLazyLoading && !areFilesLoading) {
      let newPage = queryData.page + 1;
      if (newPage <= totalPages && newPage !== queryData.page) {
        dispatch(getDriveFiles({ mode: 'lazy-add', page: newPage }));
        dispatch(assignFilesQueryData({ filesQueryData: { page: newPage } }));
      }
    }
  };

  return (
    <div
      data-animation="drive-files-list-animation-1"
      data-animation-display="block">
      <div className={styles.header}>
        <p>GHOSTDRIVE</p>
        <button onClick={viewTypeChange}>
          {viewType === 'grid' ? <ListIcon /> : <GridIcon />}
        </button>
      </div>

      <div className={styles.content}>
        {/* Initial loading */}
        {areFilesLoading && (
          <div className={styles['loader-container']}>
            <GhostLoader />
          </div>
        )}

        {/* No files found */}
        {!areFilesLoading && !areFilesLazyLoading && !files.length && (
          <div className={styles['no-files-found']}>
            <FileIcon />
            <b>{t('dashbord.notFound')}</b>
            <p>{t('dashbord.isEmpty')}</p>
          </div>
        )}

        {!!files.length && !areFilesLoading && (
          <div className={styles['list-container']} id="scrollableDiv">
            <InfiniteScroll
              ref={scrollRef}
              className={classNames(
                styles.list,
                viewType === 'grid' && styles['grid-list']
              )}
              dataLength={files.length}
              next={loadMoreItems}
              hasMore={hasMoreItemsToLoad}
              scrollableTarget="scrollableDiv">
              {files.map((file, i) => {
                return (
                  <FileViewController
                    key={file.id}
                    file={file}
                    viewType={viewType}
                    index={i}
                    showPreview={queryData.category !== 'delete'}
                  />
                );
              })}
            </InfiniteScroll>

            {areFilesLazyLoading && <LoaderRow />}
          </div>
        )}
      </div>
    </div>
  );
}
