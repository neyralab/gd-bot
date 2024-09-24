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
import system_uk from './locales/uk/system.json';
import game_uk from './locales/uk/game.json';
import drive_uk from './locales/uk/drive.json';
import system_ru from './locales/ru/system.json';
import game_ru from './locales/ru/game.json';
import drive_ru from './locales/ru/drive.json';
import system_vi from './locales/vi/system.json';
import game_vi from './locales/vi/game.json';
import drive_vi from './locales/vi/drive.json';
import system_ja from './locales/ja/system.json';
import game_ja from './locales/ja/game.json';
import drive_ja from './locales/ja/drive.json';
import system_de from './locales/de/system.json';
import game_de from './locales/de/game.json';
import drive_de from './locales/de/drive.json';
import system_fr from './locales/fr/system.json';
import game_fr from './locales/fr/game.json';
import drive_fr from './locales/fr/drive.json';
import system_ko from './locales/ko/system.json';
import game_ko from './locales/ko/game.json';
import drive_ko from './locales/ko/drive.json';

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
  uk: {
    system: system_uk,
    game: game_uk,
    drive: drive_uk,
  },
  ru: {
    system: system_ru,
    game: game_ru,
    drive: drive_ru,
  },
  vi: {
    system: system_vi,
    game: game_vi,
    drive: drive_vi,
  },
  ja: {
    system: system_ja,
    game: game_ja,
    drive: drive_ja,
  },
  de: {
    system: system_de,
    game: game_de,
    drive: drive_de,
  },
  fr: {
    system: system_fr,
    game: game_fr,
    drive: drive_fr,
  },
  ko: {
    system: system_ko,
    game: game_ko,
    drive: drive_ko,
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
