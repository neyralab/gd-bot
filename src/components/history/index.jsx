
import {ReactComponent as Face} from '../../assets/face.svg';
import {ReactComponent as Cloud} from '../../assets/clock.svg';
import {ReactComponent as Minus} from '../../assets/minus.svg';

import styles from './styles.module.css';

const history = [
    {
        img: <Face width={32} height={32}/>,
        value: '+500',
        text: 'Points for inviting a user.'
    },
    {
        img: <Cloud width={32} height={32} />,
        value: '+100',
        text: 'Points for your referral user uploading a file.'
    },
    {
        img: <Minus width={32} height={32} />,
        value: '-100',
        text: 'Expired points.'
    }
];

const bigHistory = Array(10).fill().flatMap(item => (history));

export const History = ()=> {
    return (
        <div className={styles.container}>
            <p className={styles.history}>History</p>
            <ul className={styles.list}>
                {bigHistory.map((el, index) =><li key={index} className={styles.item}>
                    {el.img}
                    <div className={styles.text_container}>
                        <p className={styles.value}>{el.value}</p>
                        <p className={styles.text}>{el.text}</p>
                    </div>
                </li>)}
            </ul>
        </div>
    )
}
