import CN from 'classnames';
import styles from './styles.module.css';

export const Button = ({label, className, onClick}) => {
    return (
        <button
            type="button"
            className={CN(styles.btn, className)}
            onClick={onClick}
        >
            {label}
        </button>
    )
};
