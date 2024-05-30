import CN from 'classnames';
import styles from './styles.module.css';

export const Tab = ({tab, active, onClick}) => {
    return (
        <button type='button' className={styles.btn} onClick={onClick}>
            <p className={CN(
                active && styles.active,
                styles.value)}
            >{tab.number}</p>
            <p className={styles.name}>{tab.name}</p>
        </button>
    )
}
