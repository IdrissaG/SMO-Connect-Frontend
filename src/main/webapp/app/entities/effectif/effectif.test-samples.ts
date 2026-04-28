import dayjs from 'dayjs/esm';

import { IEffectif, NewEffectif } from './effectif.model';

export const sampleWithRequiredData: IEffectif = {
  id: 31586,
  nom: 'malade où au-dedans de',
  actif: false,
};

export const sampleWithPartialData: IEffectif = {
  id: 21946,
  nom: 'hors snob rapide',
  mobile: 'courir',
  genre: 'M',
  matricule: 'pschitt areu areu ignorer',
  fonction: 'FORMATEUR',
  profil: 'proclamer considérable',
  vague: 'conseil d’administration',
  dateDemarrageFormation: dayjs('2026-04-27'),
  dateEntreeProd: dayjs('2026-04-28'),
  actif: true,
  nouveauAgent: true,
  envoyeTidjiReactivation: true,
  dateEnvoyeTidjiReactivation: dayjs('2026-04-27T20:46'),
  envoyeTidjiModification: true,
};

export const sampleWithFullData: IEffectif = {
  id: 15934,
  nom: 'prou trop peu',
  prenom: 'bof',
  email: 'Hincmar_Baron40@hotmail.fr',
  mobile: 'hystérique hormis',
  cni: 'plic',
  genre: 'M',
  matricule: 'vu que si dring',
  matriculeNPlus1: 'deçà hystérique',
  cuid: 'aussi administration',
  loginReferenceSelfservice: 'au cas où aussi bang',
  typeContrat: 'CONSULTANT',
  typeCompte: 'EXTERNE',
  fonction: 'FM_OPS',
  profil: 'rapprocher montrer pour',
  departement: 'sourire',
  siteProduction: 'hystérique triathlète sans que',
  vague: 'déduire à la merci élargir',
  dateRemontee: dayjs('2026-04-28'),
  dateDemarrageFormation: dayjs('2026-04-28'),
  dateEntreeProd: dayjs('2026-04-28'),
  dateSortie: dayjs('2026-04-27'),
  dateReintegration: dayjs('2026-04-27'),
  actif: true,
  nouveauAgent: false,
  envoyeTidjiCreation: false,
  dateEnvoyeTidjiCreation: dayjs('2026-04-28T14:53'),
  envoyeTidjiReset: false,
  envoyeTidjiReactivation: true,
  dateEnvoyeTidjiReactivation: dayjs('2026-04-27T22:20'),
  envoyeTidjiModification: false,
  dateEnvoyeTidjiModification: dayjs('2026-04-28T05:36'),
};

export const sampleWithNewData: NewEffectif = {
  nom: 'associer',
  actif: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
