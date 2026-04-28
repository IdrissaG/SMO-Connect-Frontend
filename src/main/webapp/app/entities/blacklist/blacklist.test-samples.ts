import dayjs from 'dayjs/esm';

import { IBlacklist, NewBlacklist } from './blacklist.model';

export const sampleWithRequiredData: IBlacklist = {
  id: 22165,
  active: false,
};

export const sampleWithPartialData: IBlacklist = {
  id: 22210,
  mobile: 'près',
  cni: 'agréable',
  faute: 'ABSENCE_NON_JUSTIFIEE',
  commentaire: '../fake-data/blob/hipster.txt',
  dateRemontee: dayjs('2026-04-27'),
  active: false,
};

export const sampleWithFullData: IBlacklist = {
  id: 14689,
  nom: 'sitôt que guide',
  prenom: 'altruiste écrire',
  mobile: 'chut',
  cni: 'près de vlan admirablement',
  email: 'Auriane22@yahoo.fr',
  faute: 'ARNAQUE',
  commentaire: '../fake-data/blob/hipster.txt',
  dateFaits: dayjs('2026-04-28'),
  dateDetection: dayjs('2026-04-28'),
  dateRemontee: dayjs('2026-04-27'),
  active: false,
};

export const sampleWithNewData: NewBlacklist = {
  active: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
