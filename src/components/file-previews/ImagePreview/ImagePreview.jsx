import { useEffect, useRef } from 'react';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import styles from './ImagePreview.module.scss';

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
    <div className={styles.container}>
      {isSvg ? (
        <div ref={svgRef}></div>
      ) : (
        <img className={styles.image} alt={file.name} src={fileContent} />
      )}

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default ImagePreview;
