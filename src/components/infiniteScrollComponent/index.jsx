import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import {
  selectFiles,
  selectFilesPage,
  setPage,
} from "../../store/reducers/filesSlice";

const InfiniteScrollComponent = ({ totalItems, children, fetchMoreFiles }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectFilesPage);
  const files = useSelector(selectFiles);
  const hasMore = totalItems - files.length > 0;

  const fetchMoreData = () => {
    dispatch(setPage(currentPage + 1));
    fetchMoreFiles(currentPage + 1);
  };

  return (
    <InfiniteScroll
      dataLength={totalItems}
      next={fetchMoreData}
      hasMore={hasMore}>
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollComponent;
