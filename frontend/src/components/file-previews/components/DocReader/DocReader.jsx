import { useEffect, useState } from 'react';
import classNames from 'classnames';
import mammoth from 'mammoth';
import styles from './DocReader.module.scss';

export default function DocReader({
  mode = 'default',
  fileContent,
  onFileReadError
}) {
  const [htmlString, setHtmlString] = useState('');

  useEffect(() => {
    if (!fileContent) return;

    fileContent
      .arrayBuffer()
      .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then((result) => {
        setHtmlString(result.value);
      })
      .catch((e) => {
        setHtmlString('');
        onFileReadError?.(e);
      });
  }, [fileContent]);

  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles['doc-viewer'],
          mode === 'simplified' && styles.simplified
        )}>
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>

      {mode === 'simplified' && (
        <div className={styles['no-action-overlay']}></div>
      )}
    </div>
  );
}
