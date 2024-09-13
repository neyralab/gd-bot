import React, { useEffect, useState } from 'react';
import styles from './TxtReader.module.scss';

export default function TxtReader({ fileContent }) {
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
      <pre>{textContent}</pre>
    </div>
  );
}
