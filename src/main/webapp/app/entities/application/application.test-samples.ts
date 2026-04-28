import { IApplication, NewApplication } from './application.model';

export const sampleWithRequiredData: IApplication = {
  id: 15800,
};

export const sampleWithPartialData: IApplication = {
  id: 32091,
};

export const sampleWithFullData: IApplication = {
  id: 12884,
  nom: 'tchou tchouu grimper',
};

export const sampleWithNewData: NewApplication = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
