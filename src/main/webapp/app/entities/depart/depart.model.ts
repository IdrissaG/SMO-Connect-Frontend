import dayjs from 'dayjs/esm';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { MotifDepart } from 'app/entities/enumerations/motif-depart.model';

export interface IDepart {
  id: number;
  dateDepart?: dayjs.Dayjs | null;
  motifDepart?: keyof typeof MotifDepart | null;
  desistementFormation?: dayjs.Dayjs | null;
  dateRemontee?: dayjs.Dayjs | null;
  envoyeTidji?: boolean | null;
  effectif?: Pick<IEffectif, 'id' | 'nom'> | null;
}

export type NewDepart = Omit<IDepart, 'id'> & { id: null };
