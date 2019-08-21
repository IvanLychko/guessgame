import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';


const resources = {
    en: {translation: en},
    ru: {translation: ru},
};
const lng = window.localStorage.getItem('locale') || "ru";

i18n.use(initReactI18next)
    .init({resources: resources as i18n.Resource, lng, keySeparator: false, interpolation: {escapeValue: false}})
    .catch(console.error);

export default i18n;