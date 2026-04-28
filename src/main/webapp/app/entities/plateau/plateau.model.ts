import { IPrestataire } from 'app/entities/prestataire/prestataire.model';

export interface IPlateau {
  id: number;
  nom?: string | null;
  prestataire?: Pick<IPrestataire, 'id' | 'nom'> | null;
}

export type NewPlateau = Omit<IPlateau, 'id'> & { id: null };
