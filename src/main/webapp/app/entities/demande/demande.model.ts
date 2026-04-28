import dayjs from 'dayjs/esm';

import { EtatDemande } from 'app/entities/enumerations/etat-demande.model';
import { TypeDemande } from 'app/entities/enumerations/type-demande.model';

export interface IDemande {
  id: number;
  type?: keyof typeof TypeDemande | null;
  statut?: keyof typeof EtatDemande | null;
  dateCreation?: dayjs.Dayjs | null;
  dateCloture?: dayjs.Dayjs | null;
  typeSla?: string | null;
}

export type NewDemande = Omit<IDemande, 'id'> & { id: null };
