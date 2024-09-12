import { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import styles from './ExcelPreview.module.scss';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';

const ExcelPreview = ({ file, fileContent }) => {
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
  }, [file, fileContent]);
  return (
    <div className={styles.container}>
      <div className={styles['excel-viewer']}>
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>

      <div className={styles['no-action-overlay']}></div>

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default ExcelPreview;
