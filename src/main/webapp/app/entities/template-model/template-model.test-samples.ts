import { ITemplateModel, NewTemplateModel } from './template-model.model';

export const sampleWithRequiredData: ITemplateModel = {
  id: 29280,
  nom: 'au prix de',
  fichier: 'éclater délectable approuver',
  actif: true,
};

export const sampleWithPartialData: ITemplateModel = {
  id: 18052,
  nom: "à l'entour de auprès de",
  fichier: 'touchant',
  actif: true,
};

export const sampleWithFullData: ITemplateModel = {
  id: 21529,
  nom: 'secours',
  fichier: 'dépendre',
  actif: true,
};

export const sampleWithNewData: NewTemplateModel = {
  nom: 'plouf considérable lors de',
  fichier: 'tic-tac conseil municipal',
  actif: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
