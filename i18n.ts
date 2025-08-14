import { dir } from 'i18next';
import { languages } from './next-i18next.config';

export function getOptions(locale = 'en') {
  return {
    supportedLngs: languages,
    fallbackLng: 'en',
    lng: locale,
    defaultNS: 'common',
  };
}

export function getDirection(locale = 'en') {
  return dir(locale);
}
