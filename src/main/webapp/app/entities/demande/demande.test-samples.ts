import dayjs from 'dayjs/esm';

import { IDemande, NewDemande } from './demande.model';

export const sampleWithRequiredData: IDemande = {
  id: 12976,
  type: 'MODIFICATION',
  statut: 'APPROUVEE',
  dateCreation: dayjs('2026-04-28T08:22'),
};

export const sampleWithPartialData: IDemande = {
  id: 16134,
  type: 'REACTIVATION',
  statut: 'CLOTUREE',
  dateCreation: dayjs('2026-04-28T01:11'),
  dateCloture: dayjs('2026-04-27T17:42'),
  typeSla: 'novice rédaction adversaire',
};

export const sampleWithFullData: IDemande = {
  id: 5647,
  type: 'REACTIVATION',
  statut: 'APPROUVEE',
  dateCreation: dayjs('2026-04-28T04:37'),
  dateCloture: dayjs('2026-04-28T06:12'),
  typeSla: 'camarade',
};

export const sampleWithNewData: NewDemande = {
  type: 'REACTIVATION',
  statut: 'CLOTUREE',
  dateCreation: dayjs('2026-04-28T00:24'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
