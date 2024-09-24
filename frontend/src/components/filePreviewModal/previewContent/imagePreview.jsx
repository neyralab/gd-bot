import { useEffect, useRef } from 'react';

import styles from './styles.module.scss';

const ImagePreview = ({ file, fileContent }) => {
  const isSvg = file.extension === 'svg';
  const svgRef = useRef(null);

  useEffect(() => {
    if (isSvg) {
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(fileContent, 'image/svg+xml');
      const svgElement = svgDocument.documentElement;
      svgRef.current.innerHTML = '';
      svgRef.current.appendChild(svgElement);
    }
  }, [fileContent]);

  return (
    <div className={styles.imageContent}>
      {isSvg ? (
        <div ref={svgRef}></div>
      ) : (
        <img className={styles.image} alt={file.name} src={fileContent} />
      )}
    </div>
  );
};

export default ImagePreview;
