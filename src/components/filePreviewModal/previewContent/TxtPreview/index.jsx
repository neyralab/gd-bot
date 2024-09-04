import { useEffect } from 'react';
import CN from 'classnames';
import s from './style.module.scss';

const TxtPreview = ({ fileContent, className }) => {
  useEffect(() => {
    const previewContainer = document.getElementById('preview-container');
    const lines = fileContent.split('\n').slice(0, 10);
    const previewText = lines.join('<br>');
    previewContainer.innerHTML = previewText;
  }, []);

  return (
    <div className={CN(s.container, className)}>
      <div id="preview-container"></div>
    </div>
  );
};

export default TxtPreview;
