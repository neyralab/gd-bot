import styles from './styles.module.css';

export const FilesInfo = ({balance}) => {
    return (
        <div className={styles.container}>
            <div className={styles.uploaded}>
                <p className={styles.text}>Uploaded files</p>
                <p className={styles.number}>{balance.fileCnt}</p>
            </div>
            <div className={styles.points}>
                <p className={styles.text}>Point balance</p>
                <p className={styles.number}>{balance.points}</p>
            </div>
        </div>
    )
}
