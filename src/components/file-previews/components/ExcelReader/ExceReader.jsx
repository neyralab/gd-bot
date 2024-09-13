import { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import classNames from 'classnames';
import styles from './ExcelReader.module.scss';

export default function ExcelReader({ mode = 'default', fileContent }) {
  const [htmlString, setHtmlString] = useState('');

  useEffect(() => {
    if (fileContent) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const htmlString = utils.sheet_to_html(worksheet);

        setHtmlString(htmlString);
      };

      reader.readAsArrayBuffer(fileContent);
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
