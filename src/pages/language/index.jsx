import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header } from '../../components/header';
import { ReactComponent as CheckIcon } from '../../assets/check.svg';
import SearchInput from './SearchInput';

import styles from './styles.module.css';

const languageList = [
  {
    title: 'English',
    translate: 'English',
    abbreviation: 'en'
  },
  {
    title: 'Indonesian',
    translate: 'bahasa Indonesia',
    abbreviation: 'id'
  },
  {
    title: 'Portuguese',
    translate: 'Português',
    abbreviation: 'pt'
  },
  {
    title: 'Spanish',
    translate: 'Español',
    abbreviation: 'es'
  },
  {
    title: 'Chinese',
    translate: '中文',
    abbreviation: 'zh'
  },
]

export const LanguagePage = () => {
  const { t, i18n } = useTranslation('system');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language])

  const changeLanguage = (option) => {
    if (option === 'zh') {
      i18n.changeLanguage('zh');
      moment.locale('zh-cn');
      localStorage.setItem('language', JSON.stringify('zh'));
    } else if (option === 'en') {
      i18n.changeLanguage('en');
      moment.locale('en');
      localStorage.setItem('language', JSON.stringify('en'));
    } else if (option === 'id') {
      i18n.changeLanguage('id');
      moment.locale('id');
      localStorage.setItem('language', JSON.stringify('id'));
    } else if (option === 'pt') {
      i18n.changeLanguage('pt');
      moment.locale('pt');
      localStorage.setItem('language', JSON.stringify('pt'));
    } else if (option.value === 'es') {
      i18n.changeLanguage('es');
      moment.locale('es');
      localStorage.setItem('language', JSON.stringify('es'));
    }
    setLang(option);
  };

  return (
    <div className={styles.container}>
      <Header label={t('dashboard.language')} />
      <SearchInput />
      <h2 className={styles.subTitle}>Interface language</h2>
      <ul className={styles.list} >
        {languageList.map(({ title, translate, abbreviation }) => (
          <li onClick={() => {changeLanguage(abbreviation)}} className={styles.item}>
            <div className={styles.itemDetail}>
              <p className={styles.lang}>{title}</p>
              <p className={styles.langOriginal}>{translate}</p>
            </div>
            <span className={styles.itemStatus}>
              { abbreviation === lang && <CheckIcon /> }
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
