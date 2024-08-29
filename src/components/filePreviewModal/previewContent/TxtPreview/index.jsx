import { useEffect } from 'react';
import s from './style.module.scss';

const TxtPreview = ({ fileContent }) => {
  useEffect(() => {
    const previewContainer = document.getElementById('preview-container');
    const lines = fileContent.split('\n').slice(0, 10);
    const previewText = lines.join('<br>');
    previewContainer.innerHTML = previewText;
  }, []);

  return (
    <div className={s.container}>
      <div id="preview-container"></div>
    </div>
  );
};

export default TxtPreview;
