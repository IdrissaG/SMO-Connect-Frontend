import dayjs from 'dayjs/esm';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { IUser } from 'app/entities/user/user.model';

export interface IConge {
  id: number;
  dateDebut?: dayjs.Dayjs | null;
  dateRetour?: dayjs.Dayjs | null;
  effectif?: Pick<IEffectif, 'id' | 'nom'> | null;
  createdBy?: Pick<IUser, 'id'> | null;
}

export type NewConge = Omit<IConge, 'id'> & { id: null };
