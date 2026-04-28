import dayjs from 'dayjs/esm';

import { IResetPassword, NewResetPassword } from './reset-password.model';

export const sampleWithRequiredData: IResetPassword = {
  id: 6734,
  application: 'à force de',
  loginWindows: 'vite',
  passwordEncrypted: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IResetPassword = {
  id: 8882,
  application: 'quoique jeune',
  loginWindows: 'biathlète franco',
  passwordEncrypted: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IResetPassword = {
  id: 10325,
  application: 'mairie',
  loginWindows: 'camarade sans que traduire',
  passwordEncrypted: '../fake-data/blob/hipster.txt',
  demandeTidjiId: 'crac super',
  dateEnvoi: dayjs('2026-04-28T16:11'),
  dateCloture: dayjs('2026-04-28T07:47'),
  etat: 'orange',
};

export const sampleWithNewData: NewResetPassword = {
  application: 'pff large',
  loginWindows: 'délégation',
  passwordEncrypted: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
