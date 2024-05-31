import { useState } from "react";
import {ReactComponent as Dollar} from '../../assets/dollar_sign.svg';
import styles from './styles.module.css';

export const Range = () =>{
    const [value, setValue] = useState(0);

    return (
        <div className={styles.container}>
            <Dollar className={styles.img}/>
            <input
                type="range"
                min="1"
                max="100"
                value={value}
                className={styles.slider}
                onChange={e=>
                    setValue(e.target.value)
                }>
            </input>
            <p className={styles.text}>x{value}</p>
        </div>
    )
}
