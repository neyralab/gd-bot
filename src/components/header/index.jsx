import {BackButton} from "../backButton";

import styles from'./styles.module.css';

export const Header = ({label}) =>{
    return (
        <header className={styles.header}>
            <BackButton/>
            <h1 className={styles.head}>{label}</h1>
            <div className={styles.empty}/>
        </header>
    )
};
