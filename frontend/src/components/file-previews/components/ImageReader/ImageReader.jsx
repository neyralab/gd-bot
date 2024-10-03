import { useEffect, useRef, useState } from 'react';
import styles from './ImageReader.module.scss';

export default function ImageReader({
  file,
  fileContent,
  fileContentType = 'blob',
  onFileReadError
}) {
  const [url, setUrl] = useState();
  const svgRef = useRef(null);

  useEffect(() => {
    if (fileContentType === 'blob') {
      const objectUrl = URL.createObjectURL(fileContent);
      setUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    if (fileContentType === 'url') {
      setUrl(fileContent);
    }
  }, [fileContent, fileContentType]);

  useEffect(() => {
    if (file.extension === 'svg' && svgRef.current) {
      if (fileContentType === 'url') {
        fetch(fileContent)
          .then((response) => response.text())
          .then((svgText) => {
            const parser = new DOMParser();
            const svgDocument = parser.parseFromString(
              svgText,
              'image/svg+xml'
            );
            const svgElement = svgDocument.documentElement;
            svgRef.current.innerHTML = '';
            svgRef.current.appendChild(svgElement);
          })
          .catch((e) => {
            onFileReadError?.(e);
          });
      } else if (fileContentType === 'blob') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const parser = new DOMParser();
          const svgDocument = parser.parseFromString(
            e.target.result,
            'image/svg+xml'
          );
          const svgElement = svgDocument.documentElement;
          svgRef.current.innerHTML = '';
          svgRef.current.appendChild(svgElement);
        };
        reader.onerror = (e) => {
          onFileReadError?.(e);
        };
        reader.readAsText(fileContent);
      }
    }
  }, [url, file, fileContentType, svgRef.current]);

  if (!file || !file.extension) return null;

  return (
    <div className={styles.container}>
      {file.extension === 'svg' ? (
        <div className={styles['svg-container']} ref={svgRef}></div>
      ) : (
        <img
          className={styles.image}
          alt={file.name}
          src={url}
          onError={(e) => onFileReadError?.(e)}
        />
      )}
    </div>
  );
}
