import dayjs from 'dayjs/esm';

import { IDepart, NewDepart } from './depart.model';

export const sampleWithRequiredData: IDepart = {
  id: 30285,
  envoyeTidji: false,
};

export const sampleWithPartialData: IDepart = {
  id: 9908,
  dateDepart: dayjs('2026-04-28'),
  desistementFormation: dayjs('2026-04-28T14:10'),
  envoyeTidji: true,
};

export const sampleWithFullData: IDepart = {
  id: 18551,
  dateDepart: dayjs('2026-04-28'),
  motifDepart: 'MUTATION',
  desistementFormation: dayjs('2026-04-28T02:17'),
  dateRemontee: dayjs('2026-04-28'),
  envoyeTidji: false,
};

export const sampleWithNewData: NewDepart = {
  envoyeTidji: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
