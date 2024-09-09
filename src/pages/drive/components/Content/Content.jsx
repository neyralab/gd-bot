import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Categories from '../Categories/Categories';
import FilesList from '../FilesList/FilesList';
import {
  hideCategoriesAnimation,
  hideFilesListAnimation,
  showCategoriesAnimation,
  showFilesListAnimation
} from './animations';
import styles from './Content.module.scss';

export default function Content() {
  const queryData = useSelector((state) => state.drive.filesQueryData);
  const [mode, setMode] = useState(); // 'categories' | 'files'

  useEffect(() => {
    if (!!queryData.search || queryData.category !== null) {
      setMode('files');
    } else {
      setMode('categories');
    }
  }, [queryData]);

  useEffect(() => {
    if (mode === 'categories') {
      showCategoriesAnimation();
      hideFilesListAnimation();
    }
    if (mode === 'files') {
      showFilesListAnimation();
      hideCategoriesAnimation();
    }
  }, [mode]);

  return (
    <div className={styles.container}>
      <Categories />
      <FilesList />
    </div>
  );
}
