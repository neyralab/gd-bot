import { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';

import s from './style.module.scss';

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
    <div className={s.container}>
      <div className={s.excelViewer}>
        <div dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>
    </div>
  );
};

export default ExcelPreview;
