import dayjs from 'dayjs/esm';

import { IEffectif } from 'app/entities/effectif/effectif.model';

export interface IResetPassword {
  id: number;
  application?: string | null;
  loginWindows?: string | null;
  passwordEncrypted?: string | null;
  demandeTidjiId?: string | null;
  dateEnvoi?: dayjs.Dayjs | null;
  dateCloture?: dayjs.Dayjs | null;
  etat?: string | null;
  effectif?: Pick<IEffectif, 'id' | 'nom'> | null;
}

export type NewResetPassword = Omit<IResetPassword, 'id'> & { id: null };
