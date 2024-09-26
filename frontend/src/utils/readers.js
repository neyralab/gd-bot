import { read, utils } from 'xlsx';

export const readBlobContent = (fileContent) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject('Error reading file');
    };
    reader.readAsText(fileContent);
  });
};

export const readExcelContent = (fileContent) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });

        if (!workbook.SheetNames.length) {
          throw new Error('No sheets found in the Excel file');
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          throw new Error('Sheet not found in the Excel file');
        }

        const htmlString = utils.sheet_to_html(worksheet);
        resolve(htmlString);
      } catch (error) {
        reject(new Error(`Error processing Excel content: ${error.message}`));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading Excel content'));
    };
    reader.readAsArrayBuffer(fileContent);
  }).catch((error) => {
    console.error('Error reading Excel content:', error);
    return Promise.reject(error);
  });
};
