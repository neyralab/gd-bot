import { read, utils } from 'xlsx';

export const readBlobContent = async (fileContent, onLoad) => {
  try {
    const response = await fetch(fileContent);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onload = () => {
      onLoad?.(reader.result);
    };

    reader.readAsText(blob);
  } catch (error) {
    console.error('Error fetching blob content:', error);
  }
};

export const readExcelContent = async (fileContent, onLoad) => {
  try {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const htmlString = utils.sheet_to_html(worksheet);

      onLoad?.(htmlString);
    };

    reader.readAsArrayBuffer(fileContent);
  } catch (error) {
    console.error('Error reading excel content:', error);
  }
};
