import { useEffect } from "react";
import moment from 'moment';
import i18n from 'i18next';

const useLanguage = () => {
  useEffect(() => {
    const languageDetection = localStorage.getItem('language') as string;
    if (languageDetection === null) {
      const language = navigator.language.toLowerCase();
      if (language.includes('zh')) {
        i18n.changeLanguage('zh');
        moment.locale('zh-cn');
      } else if (language.includes('id')) {
        i18n.changeLanguage('id');
        moment.locale('id');
      } else if (language.includes('pt')) {
        i18n.changeLanguage('pt');
        moment.locale('pt');
      } else if (language.includes('es')) {
        i18n.changeLanguage('es');
        moment.locale('es');
      } else {
        i18n.changeLanguage('en');
        moment.locale('en');
      }
    } else {
      i18n.changeLanguage(languageDetection);
      moment.locale(languageDetection);
    }
  }, []);
}

export { useLanguage };