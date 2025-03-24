import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      fr: {
        translation: {
          welcome: 'Bienvenue sur notre application',
          login: 'Connexion',
          register: 'Inscription'
        }
      },
      en: {
        translation: {
          welcome: 'Welcome to our application',
          login: 'Login',
          register: 'Register'
        }
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;