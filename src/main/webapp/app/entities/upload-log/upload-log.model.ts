import { TypeFichier } from 'app/entities/enumerations/type-fichier.model';

export interface IUploadLog {
  id: number;
  typeFichier?: keyof typeof TypeFichier | null;
  nomFichier?: string | null;
  nombreLignes?: number | null;
  succesCount?: number | null;
  erreurCount?: number | null;
  doublonCount?: number | null;
  entite?: string | null;
}

export type NewUploadLog = Omit<IUploadLog, 'id'> & { id: null };
