import dayjs from 'dayjs/esm';

import { IConge, NewConge } from './conge.model';

export const sampleWithRequiredData: IConge = {
  id: 31767,
  dateDebut: dayjs('2026-04-28'),
  dateRetour: dayjs('2026-04-28'),
};

export const sampleWithPartialData: IConge = {
  id: 17933,
  dateDebut: dayjs('2026-04-28'),
  dateRetour: dayjs('2026-04-28'),
};

export const sampleWithFullData: IConge = {
  id: 466,
  dateDebut: dayjs('2026-04-28'),
  dateRetour: dayjs('2026-04-27'),
};

export const sampleWithNewData: NewConge = {
  dateDebut: dayjs('2026-04-28'),
  dateRetour: dayjs('2026-04-28'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
