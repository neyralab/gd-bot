import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Header } from '../../components/header';
import { ReactComponent as CheckIcon } from '../../assets/check.svg';
import SearchInput from './SearchInput';
import { runInitAnimation, runListAnimation } from './animations';
import { debounce } from '../../utils/debounce';
import styles from './styles.module.scss';

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
  {
    title: 'Ukrainian',
    translate: 'Українська',
    shortName: 'ukr',
    abbreviation: 'uk'
  },
  {
    title: 'Russian',
    translate: 'Русский',
    shortName: 'rus',
    abbreviation: 'ru'
  },
  {
    title: 'Vietnamese',
    translate: 'Tiếng Việt',
    shortName: 'vie',
    abbreviation: 'vi'
  },
  {
    title: 'Japanese',
    translate: '日本語',
    shortName: 'jpn',
    abbreviation: 'ja'
  },
  {
    title: 'German',
    translate: 'Deutsch',
    shortName: 'deu',
    abbreviation: 'de'
  },
  {
    title: 'French',
    translate: 'Français',
    shortName: 'fre',
    abbreviation: 'fr'
  },
  {
    title: 'Korean',
    translate: '한국어',
    shortName: 'kor',
    abbreviation: 'ko'
  }
];

export const LanguagePage = () => {
  const { t, i18n } = useTranslation('system');
  const [lang, setLang] = useState('en');
  const [searchValue, setSearchValue] = useState('');
  const [list, setList] = useState(LANGUAGE_LIST);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    runInitAnimation();
  }, []);

  useEffect(() => {
    if (!list) return;
    runListAnimation();
  }, [list]);

  const changeLanguage = (option) => {
    i18n.changeLanguage(option);
    moment.locale(option);
    localStorage.setItem('language', option);
    setLang(option);
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      const valueToCheck = value.trim().toLowerCase();
      if (value) {
        const filteredList = LANGUAGE_LIST.filter(
          (item) =>
            item.title.toLowerCase().includes(valueToCheck) ||
            item.translate.toLowerCase().includes(valueToCheck) ||
            item.shortName.toLowerCase().includes(valueToCheck) ||
            item.abbreviation.toLowerCase().includes(valueToCheck)
        );
        setList(filteredList);
      } else {
        setList(LANGUAGE_LIST);
      }
    }, 300),
    []
  );

  const onChange = ({ target: { value } }) => {
    handleSearchChange(value);
    setSearchValue(value);
  };

  const onReset = () => {
    setSearchValue('');
    setList(LANGUAGE_LIST);
  };

  return (
    <div className={styles.container}>
      <Header hideBack label={t('dashboard.language')} />
      <SearchInput value={searchValue} onChange={onChange} onClose={onReset} />
      <h2 data-animation="language-animation-2" className={styles.subTitle}>
        {t('language.interface')}
      </h2>
      {!!list.length && (
        <ul className={styles.list}>
          {list.map(({ title, translate, abbreviation }) => (
            <li
              onClick={() => {
                changeLanguage(abbreviation);
              }}
              className={styles.item}
              key={abbreviation}
              data-animation="language-animation-1">
              <div>
                <p className={styles.lang}>{title}</p>
                <p className={styles.langOriginal}>{translate}</p>
              </div>
              <span className={styles.itemStatus}>
                {abbreviation === lang && <CheckIcon />}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
