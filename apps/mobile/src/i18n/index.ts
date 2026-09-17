import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Khetha AI',
      findPath: 'Find my path',
      journey: 'My journey',
      directory: 'Explore careers',
      profile: 'Profile',
    },
  },
  xh: {
    translation: {
      appName: 'Khetha AI',
      findPath: 'Fumana indlela yam',
      journey: 'Uhambo lwam',
      directory: 'Jonga imisebenzi',
      profile: 'Iprofayile',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

