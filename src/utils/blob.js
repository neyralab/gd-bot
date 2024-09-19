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
