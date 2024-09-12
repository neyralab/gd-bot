import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import ExcelSnapshotReader from '../components/ExcelSnapshotReader/ExcelSnapshotReader';
import styles from './ExcelPreview.module.scss';

const ExcelPreview = ({
  mode = 'default',
  file,
  fileContent,
  onFavoriteClick,
  onInfoClick
}) => {
  return (
    <div className={styles.container}>
      <ExcelSnapshotReader fileContent={fileContent} />

      {mode === 'default' && (
        <>
          <DefaultFileTitle file={file} />
          <DefaultFileActions
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        </>
      )}
    </div>
  );
};

export default ExcelPreview;
