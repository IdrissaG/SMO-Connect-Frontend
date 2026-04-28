import dayjs from 'dayjs/esm';

import { Fonction } from 'app/entities/enumerations/fonction.model';
import { Genre } from 'app/entities/enumerations/genre.model';
import { TypeCompte } from 'app/entities/enumerations/type-compte.model';
import { TypeContrat } from 'app/entities/enumerations/type-contrat.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';

export interface IEffectif {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  mobile?: string | null;
  cni?: string | null;
  genre?: keyof typeof Genre | null;
  matricule?: string | null;
  matriculeNPlus1?: string | null;
  cuid?: string | null;
  loginReferenceSelfservice?: string | null;
  typeContrat?: keyof typeof TypeContrat | null;
  typeCompte?: keyof typeof TypeCompte | null;
  fonction?: keyof typeof Fonction | null;
  profil?: string | null;
  departement?: string | null;
  siteProduction?: string | null;
  vague?: string | null;
  dateRemontee?: dayjs.Dayjs | null;
  dateDemarrageFormation?: dayjs.Dayjs | null;
  dateEntreeProd?: dayjs.Dayjs | null;
  dateSortie?: dayjs.Dayjs | null;
  dateReintegration?: dayjs.Dayjs | null;
  actif?: boolean | null;
  nouveauAgent?: boolean | null;
  envoyeTidjiCreation?: boolean | null;
  dateEnvoyeTidjiCreation?: dayjs.Dayjs | null;
  envoyeTidjiReset?: boolean | null;
  envoyeTidjiReactivation?: boolean | null;
  dateEnvoyeTidjiReactivation?: dayjs.Dayjs | null;
  envoyeTidjiModification?: boolean | null;
  dateEnvoyeTidjiModification?: dayjs.Dayjs | null;
  prestataire?: Pick<IPrestataire, 'id' | 'nom'> | null;
  plateau?: Pick<IPlateau, 'id' | 'nom'> | null;
}

export type NewEffectif = Omit<IEffectif, 'id'> & { id: null };
