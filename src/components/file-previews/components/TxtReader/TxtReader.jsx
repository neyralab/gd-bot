import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './TxtReader.module.scss';

export default function TxtReader({ mode = 'default', fileContent }) {
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (fileContent) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target.result);
      };
      reader.onerror = () => {
        setTextContent('Error reading file');
      };
      reader.readAsText(fileContent);
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
