import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './TxtReader.module.scss';

export default function TxtReader({ mode = 'default', fileContent }) {
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
    <div
      className={classNames(
        styles.container,
        mode === 'simplified' && styles.simplified
      )}>
      <pre>{textContent}</pre>
    </div>
  );
}
