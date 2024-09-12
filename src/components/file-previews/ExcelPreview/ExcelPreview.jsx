import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import ExcelSnapshotReader from '../components/ExcelSnapshotReader/ExcelSnapshotReader';
import styles from './ExcelPreview.module.scss';

const ExcelPreview = ({ file, fileContent }) => {
  return (
    <div className={styles.container}>
      <ExcelSnapshotReader fileContent={fileContent} />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default ExcelPreview;
