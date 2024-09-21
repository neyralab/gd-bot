import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';

import { selectFilesPage, setPage } from '../../store/reducers/filesSlice';

import s from './style.module.css';

const InfiniteScrollComponent = ({
  totalItems,
  children,
  fetchMoreFiles,
  files
}) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectFilesPage);
  const hasMore = totalItems - files.length > 0;

  const fetchMoreData = () => {
    dispatch(setPage(currentPage + 1));
    fetchMoreFiles(currentPage + 1);
  };

  return (
    <div className={s.infiniteScroll}>
      <InfiniteScroll
        dataLength={totalItems}
        next={fetchMoreData}
        hasMore={hasMore}>
        {children}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollComponent;
