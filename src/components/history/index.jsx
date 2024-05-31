import { useEffect, useState } from 'react';
import { NoHistory } from './empty';
import { getBalanceEffect } from '../../effects/balanceEffect';

import {ReactComponent as Cloud} from '../../assets/clock.svg';
import styles from './styles.module.css';

export const History = ()=> {
    const [history, setHistory] = useState();

    useEffect(() => {
        (async ()=>{
            try{
                const {data} = await getBalanceEffect()
                setHistory(data.data)
                console.log({getBalanceEffect:data});
            }catch(e){
                console.log({getBalanceEffectErr:e});
            }
        })()
    }, []);

    return (
        <div className={styles.container}>
            <p className={styles.history}>History</p>
            <ul className={styles.list}>
                {!history
                  ? <NoHistory/>
                  : history.map((el, index) =>
                    <li key={index} className={styles.item}>
                        <Cloud width={32} height={32} />
                    <div className={styles.text_container}>
                        <p className={styles.value}>{el.points}</p>
                        <p className={styles.text}>{'Points for your uploading a file.'}</p>
                    </div>
                </li>)}
            </ul>
        </div>
    )
}
