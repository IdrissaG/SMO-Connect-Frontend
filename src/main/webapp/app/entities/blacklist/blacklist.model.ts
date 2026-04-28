import dayjs from 'dayjs/esm';

import { TypeFaute } from 'app/entities/enumerations/type-faute.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';

export interface IBlacklist {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  mobile?: string | null;
  cni?: string | null;
  email?: string | null;
  faute?: keyof typeof TypeFaute | null;
  commentaire?: string | null;
  dateFaits?: dayjs.Dayjs | null;
  dateDetection?: dayjs.Dayjs | null;
  dateRemontee?: dayjs.Dayjs | null;
  active?: boolean | null;
  prestataire?: Pick<IPrestataire, 'id' | 'nom'> | null;
  plateau?: Pick<IPlateau, 'id' | 'nom'> | null;
}

export type NewBlacklist = Omit<IBlacklist, 'id'> & { id: null };
