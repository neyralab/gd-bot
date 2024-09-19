import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { readBlobContent } from '../../../../utils/blob';
import styles from './TxtReader.module.scss';

export default function TxtReader({ mode = 'default', fileContent }) {
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (fileContent) {
      readBlobContent(fileContent, setTextContent);
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
