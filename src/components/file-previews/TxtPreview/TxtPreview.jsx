import React, { useEffect, useState } from 'react';
import styles from './TxtPreview.module.scss';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';

const TxtPreview = ({ fileContent, file }) => {
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    const readBlobContent = async () => {
      try {
        const response = await fetch(fileContent);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = () => {
          setTextContent(reader.result);
        };

        reader.readAsText(blob);
      } catch (error) {
        console.error('Error fetching blob content:', error);
      }
    };

    if (fileContent) {
      readBlobContent();
    }
  }, [fileContent]);

  return (
    <div className={styles.container}>
      <div id="preview-container" className={styles.preview}>
        <pre>{textContent}</pre>
      </div>

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default TxtPreview;
