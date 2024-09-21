import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { readBlobContent } from '../../../../utils/readers';

import styles from './TxtReader.module.scss';

export default function TxtReader({ mode = 'default', fileContent }) {
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (fileContent) {
      readBlobContent(fileContent)
        .then((content) => setTextContent(content))
        .catch((error) => setTextContent(error));
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
