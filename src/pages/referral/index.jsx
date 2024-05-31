import { useState } from 'react';

import styles from './styles.module.css';
import { Header } from '../../components/header';
import { Tab } from '../../components/tab';
import { Button } from '../../components/button';
import {History} from '../../components/history'

const tabs = [
  {
    number: 0,
    name: 'users'
  },
  {
    number: 0,
    name: 'referral files'
  },
  {
    number: 0,
    name: 'earn'
  },
]

export const Referral = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const copyMe = () => {
    const url = window.location.href;
    console.log(url);
  };

  return (
    <div className={styles.container}>
      <Header label='Referral System'/>
      <div className={styles.tabs}>
        {tabs.map((el, index)=> <Tab active={el.name === activeTab.name} tab={el} key={index} onClick={()=>setActiveTab(el)}/>)}
      </div>
      <History />
      <footer >
        <Button label='Copy link' onClick={copyMe} className={styles.white_btn} />
        <Button label='Send link' onClick={()=> console.log('send')} className={styles.black_btn}/>
      </footer>
    </div>
  )
}
