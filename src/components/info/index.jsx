import {ReactComponent as CircleBackgroundIcon} from '../../assets/background.svg'

import styles from './styles.module.css';

export const InfoBox = ({size}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.value}>{size}</p>
                <p className={styles.text}>Storage</p>
            </div>
            <div className={styles.circle}>
              <CircleBackgroundIcon/>
            </div>
        </div>
    )
}
