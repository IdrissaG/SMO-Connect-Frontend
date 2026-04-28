import dayjs from 'dayjs/esm';

import { IEmailTraite, NewEmailTraite } from './email-traite.model';

export const sampleWithRequiredData: IEmailTraite = {
  id: 18451,
  messageId: 'de par glouglou',
  dateReception: dayjs('2026-04-28T01:34'),
  traiteAvecSucces: false,
};

export const sampleWithPartialData: IEmailTraite = {
  id: 10039,
  messageId: 'conquérir enfin jouer',
  dateReception: dayjs('2026-04-28T07:34'),
  nomExtrait: "exposer à l'entour de",
  applicationExtrait: 'avant',
  loginExtrait: 'mince calme',
  traiteAvecSucces: false,
};

export const sampleWithFullData: IEmailTraite = {
  id: 6347,
  messageId: 'autrefois pendant que',
  dateReception: dayjs('2026-04-28T12:24'),
  nomExtrait: 'incalculable avancer',
  prenomExtrait: 'avex clientèle',
  applicationExtrait: 'de façon que ronron',
  loginExtrait: "aujourd'hui menacer couler",
  traiteAvecSucces: true,
  erreur: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewEmailTraite = {
  messageId: 'rectorat à côté de méconnaître',
  dateReception: dayjs('2026-04-28T02:47'),
  traiteAvecSucces: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
