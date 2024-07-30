import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { Header } from '../../components/header';
import { ReactComponent as CheckIcon } from '../../assets/check.svg';
import SearchInput from './SearchInput';

import styles from './styles.module.css';

export const LANGUAGE_LIST = [
  {
    title: 'English',
    translate: 'English',
    shortName: 'eng',
    abbreviation: 'en'
  },
  {
    title: 'Indonesian',
    translate: 'bahasa Indonesia',
    shortName: 'ind',
    abbreviation: 'id'
  },
  {
    title: 'Portuguese',
    translate: 'Português',
    shortName: 'por',
    abbreviation: 'pt'
  },
  {
    title: 'Spanish',
    translate: 'Español',
    shortName: 'spa',
    abbreviation: 'es'
  },
  {
    title: 'Chinese',
    translate: '中文',
    shortName: 'chi',
    abbreviation: 'zh'
  },
]

export const LanguagePage = () => {
  const { t, i18n } = useTranslation('system');
  const [lang, setLang] = useState('en');
  const [searchValue, setSearchValue] = useState('');
  const [list, setList] = useState(LANGUAGE_LIST);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language])

  const changeLanguage = (option) => {
    if (option === 'zh') {
      i18n.changeLanguage('zh');
      moment.locale('zh-cn');
      localStorage.setItem('language', 'zh');
    } else if (option === 'en') {
      i18n.changeLanguage('en');
      moment.locale('en');
      localStorage.setItem('language', 'en');
    } else if (option === 'id') {
      i18n.changeLanguage('id');
      moment.locale('id');
      localStorage.setItem('language', 'id');
    } else if (option === 'pt') {
      i18n.changeLanguage('pt');
      moment.locale('pt');
      localStorage.setItem('language', 'pt');
    } else if (option === 'es') {
      i18n.changeLanguage('es');
      moment.locale('es');
      localStorage.setItem('language', 'es');
    }
    setLang(option);
  };

  const onChange = ({ target: { value } }) => {
    if (value) {
      setSearchValue(value);
      const filteredList = LANGUAGE_LIST.filter((item) => (
        item.title.includes(value) ||
        item.translate.includes(value) ||
        item.shortName.includes(value) ||
        item.abbreviation.includes(value)
      ));
      setList(filteredList);
    } else {
      setSearchValue('');
      setList(LANGUAGE_LIST);
    }
  }

  const onReset = () => {
    setSearchValue('');
    setList(LANGUAGE_LIST);
  }

  return (
    <div className={styles.container}>
      <Header label={t('dashboard.language')} />
      <SearchInput
        value={searchValue}
        onChange={onChange}
        onClose={onReset}
      />
      <h2 className={styles.subTitle}>{t('language.interface')}</h2>
      {!!list.length && 
        (<ul className={styles.list} >
          {list.map(({ title, translate, abbreviation }) => (
            <li
              onClick={() => {changeLanguage(abbreviation)}}
              className={styles.item}
              key={abbreviation}
            >
              <div>
                <p className={styles.lang}>{title}</p>
                <p className={styles.langOriginal}>{translate}</p>
              </div>
              <span className={styles.itemStatus}>
                { abbreviation === lang && <CheckIcon /> }
              </span>
            </li>
          ))}
        </ul>)
      }
    </div>
  );
};
