import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { readExcelContent } from '../../../../utils/readers';
import styles from './ExcelReader.module.scss';

export default function ExcelReader({
  mode = 'default',
  fileContent,
  onFileReadError
}) {
  const [htmlString, setHtmlString] = useState('');

  useEffect(() => {
    if (fileContent) {
      readExcelContent(fileContent)
        .then((result) => {
          setHtmlString(result);
        })
        .catch((e) => {
          setHtmlString('');
          onFileReadError?.(e);
        });
    }
  }, [fileContent]);

  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles['excel-viewer'],
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
