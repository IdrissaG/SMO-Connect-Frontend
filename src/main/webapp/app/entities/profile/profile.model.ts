import { TypeUtilisateur } from 'app/entities/enumerations/type-utilisateur.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';

export interface IProfile {
  id: number;
  typeUtilisateur?: keyof typeof TypeUtilisateur | null;
  matricule?: string | null;
  structure?: string | null;
  prestataire?: Pick<IPrestataire, 'id' | 'nom'> | null;
  plateau?: Pick<IPlateau, 'id' | 'nom'> | null;
}

export type NewProfile = Omit<IProfile, 'id'> & { id: null };
