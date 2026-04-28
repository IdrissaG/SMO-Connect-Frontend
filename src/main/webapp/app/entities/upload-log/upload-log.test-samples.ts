import { IUploadLog, NewUploadLog } from './upload-log.model';

export const sampleWithRequiredData: IUploadLog = {
  id: 31940,
  typeFichier: 'EFFECTIF',
  nomFichier: 'malgré à travers au-dessous',
};

export const sampleWithPartialData: IUploadLog = {
  id: 7964,
  typeFichier: 'DEPART_MANUEL',
  nomFichier: 'enterrer placide',
  doublonCount: 20293,
  entite: 'à partir de ding bondir',
};

export const sampleWithFullData: IUploadLog = {
  id: 5823,
  typeFichier: 'DEPART_MANUEL',
  nomFichier: 'autoriser',
  nombreLignes: 22294,
  succesCount: 10169,
  erreurCount: 2637,
  doublonCount: 3043,
  entite: 'bien que lâche pendant que',
};

export const sampleWithNewData: NewUploadLog = {
  typeFichier: 'DEPART',
  nomFichier: 'au-dehors',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
