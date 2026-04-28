import dayjs from 'dayjs/esm';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { IResetPassword } from 'app/entities/reset-password/reset-password.model';

export interface IEmailTraite {
  id: number;
  messageId?: string | null;
  dateReception?: dayjs.Dayjs | null;
  nomExtrait?: string | null;
  prenomExtrait?: string | null;
  applicationExtrait?: string | null;
  loginExtrait?: string | null;
  traiteAvecSucces?: boolean | null;
  erreur?: string | null;
  effectif?: Pick<IEffectif, 'id' | 'nom'> | null;
  resetPassword?: Pick<IResetPassword, 'id'> | null;
}

export type NewEmailTraite = Omit<IEmailTraite, 'id'> & { id: null };
