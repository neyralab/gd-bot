import { useEffect, useRef, useState } from 'react';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import styles from './ImagePreview.module.scss';

const ImagePreview = ({ file, fileContent }) => {
  const [url, setUrl] = useState(URL.createObjectURL(fileContent));
  const isSvg = file.extension === 'svg';
  const svgRef = useRef(null);

  useEffect(() => {
    setUrl(URL.createObjectURL(fileContent));
  }, [fileContent]);

  useEffect(() => {
    if (isSvg && typeof fileContent === 'string') {
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(fileContent, 'image/svg+xml');
      const svgElement = svgDocument.documentElement;
      svgRef.current.innerHTML = '';
      svgRef.current.appendChild(svgElement);
    }
  }, [fileContent, isSvg]);

  return (
    <div className={styles.container}>
      {isSvg ? (
        <div ref={svgRef}></div>
      ) : (
        <img className={styles.image} alt={file.name} src={url} />
      )}

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default ImagePreview;
