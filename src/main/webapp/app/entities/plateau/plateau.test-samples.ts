import { IPlateau, NewPlateau } from './plateau.model';

export const sampleWithRequiredData: IPlateau = {
  id: 9042,
  nom: 'pacifique vaste cocorico',
};

export const sampleWithPartialData: IPlateau = {
  id: 27776,
  nom: 'peindre également commis',
};

export const sampleWithFullData: IPlateau = {
  id: 4167,
  nom: 'rectangulaire au point que',
};

export const sampleWithNewData: NewPlateau = {
  nom: 'extra',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
