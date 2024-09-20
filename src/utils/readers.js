import { read, utils } from 'xlsx';

export const readBlobContent = (fileContent) => {
  return fetch(fileContent)
    .then(response => response.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(new Error('Error reading blob content'));
        };
        reader.readAsText(blob);
      });
    })
    .catch(error => {
      console.error('Error fetching blob content:', error);
      return Promise.reject(error);
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
  }).catch(error => {
    console.error('Error reading excel content:', error);
    return Promise.reject(error);
  });
};
