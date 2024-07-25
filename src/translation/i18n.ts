import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import system_en from './locales/en/system.json';
import game_en from './locales/en/game.json';
import drive_en from './locales/en/drive.json';
import system_es from './locales/es/system.json';
import game_es from './locales/es/game.json';
import drive_es from './locales/es/drive.json';
import system_id from './locales/id/system.json';
import game_id from './locales/id/game.json';
import drive_id from './locales/id/drive.json';
import system_pt from './locales/pt/system.json';
import game_pt from './locales/pt/game.json';
import drive_pt from './locales/pt/drive.json';
import system_zh from './locales/zh/system.json';
import game_zh from './locales/zh/game.json';
import drive_zh from './locales/zh/drive.json';

const resources = {
  en: {
    system: system_en,
    game: game_en,
    drive: drive_en,
  },
  es: {
    system: system_es,
    game: game_es,
    drive: drive_es,
  },
  id: {
    system: system_id,
    game: game_id,
    drive: drive_id,
  },
  pt: {
    system: system_pt,
    game: game_pt,
    drive: drive_pt,
  },
  zh: {
    system: system_zh,
    game: game_zh,
    drive: drive_zh,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    detection: {
      order: ['navigator'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
