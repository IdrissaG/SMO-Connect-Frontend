import { IProfile, NewProfile } from './profile.model';

export const sampleWithRequiredData: IProfile = {
  id: 18889,
  typeUtilisateur: 'INTERNE',
};

export const sampleWithPartialData: IProfile = {
  id: 23204,
  typeUtilisateur: 'PRESTATAIRE',
  matricule: 'nonobstant boulanger',
  structure: 'tant pardonner confirmer',
};

export const sampleWithFullData: IProfile = {
  id: 29727,
  typeUtilisateur: 'INTERNE',
  matricule: "à l'égard de électorat",
  structure: 'dans serviable',
};

export const sampleWithNewData: NewProfile = {
  typeUtilisateur: 'PRESTATAIRE',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
