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
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const htmlString = utils.sheet_to_html(worksheet);

        resolve(htmlString);
      } catch (error) {
        reject(new Error('Error processing excel content'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading excel content'));
    };
    reader.readAsArrayBuffer(fileContent);
  }).catch((error) => {
    console.error('Error reading excel content:', error);
    return Promise.reject(error);
  });
};
