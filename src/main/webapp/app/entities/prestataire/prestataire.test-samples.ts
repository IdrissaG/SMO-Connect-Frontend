import { IPrestataire, NewPrestataire } from './prestataire.model';

export const sampleWithRequiredData: IPrestataire = {
  id: 20812,
  nom: 'commissionnaire',
};

export const sampleWithPartialData: IPrestataire = {
  id: 8477,
  nom: 'derrière lunatique effacer',
};

export const sampleWithFullData: IPrestataire = {
  id: 16337,
  nom: 'joliment sombre',
};

export const sampleWithNewData: NewPrestataire = {
  nom: 'de façon à ce que coac coac parlementaire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
