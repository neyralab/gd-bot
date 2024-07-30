import { useEffect } from "react";
import moment from 'moment';
import i18n from 'i18next';

const LANGUAGE_KEY = 'language'

const useLanguage = () => {
  useEffect(() => {
    const languageDetection = localStorage.getItem(LANGUAGE_KEY) as string;
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
      } else if (language.includes('uk')) {
        i18n.changeLanguage('uk');
        moment.locale('uk');
      } else if (language.includes('ru')) {
        i18n.changeLanguage('ru');
        moment.locale('ru');
      } else if (language.includes('vi')) {
        i18n.changeLanguage('vi');
        moment.locale('vi');
      } else if (language.includes('ja')) {
        i18n.changeLanguage('ja');
        moment.locale('ja');
      } else if (language.includes('de')) {
        i18n.changeLanguage('de');
        moment.locale('de');
      } else if (language.includes('fr')) {
        i18n.changeLanguage('fr');
        moment.locale('fr');
      } else if (language.includes('ko')) {
        i18n.changeLanguage('ko');
        moment.locale('ko');
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

const useResetLanguage = () => {
  useEffect(() => {
    const languageDetection = localStorage.getItem(LANGUAGE_KEY) as string;

    if (languageDetection && languageDetection !== "en") {
      localStorage.removeItem(LANGUAGE_KEY);
      i18n.changeLanguage('en');
      moment.locale('en');
    } else if (!languageDetection && i18n.language !== "en") {
      i18n.changeLanguage('en');
      moment.locale('en');
    }
  },  []) 
}

export { useLanguage, useResetLanguage };