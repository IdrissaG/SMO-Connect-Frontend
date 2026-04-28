import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IResetPassword, NewResetPassword } from '../reset-password.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IResetPassword for edit and NewResetPasswordFormGroupInput for create.
 */
type ResetPasswordFormGroupInput = IResetPassword | PartialWithRequiredKeyOf<NewResetPassword>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IResetPassword | NewResetPassword> = Omit<T, 'dateEnvoi' | 'dateCloture'> & {
  dateEnvoi?: string | null;
  dateCloture?: string | null;
};

type ResetPasswordFormRawValue = FormValueOf<IResetPassword>;

type NewResetPasswordFormRawValue = FormValueOf<NewResetPassword>;

type ResetPasswordFormDefaults = Pick<NewResetPassword, 'id' | 'dateEnvoi' | 'dateCloture'>;

type ResetPasswordFormGroupContent = {
  id: FormControl<ResetPasswordFormRawValue['id'] | NewResetPassword['id']>;
  application: FormControl<ResetPasswordFormRawValue['application']>;
  loginWindows: FormControl<ResetPasswordFormRawValue['loginWindows']>;
  passwordEncrypted: FormControl<ResetPasswordFormRawValue['passwordEncrypted']>;
  demandeTidjiId: FormControl<ResetPasswordFormRawValue['demandeTidjiId']>;
  dateEnvoi: FormControl<ResetPasswordFormRawValue['dateEnvoi']>;
  dateCloture: FormControl<ResetPasswordFormRawValue['dateCloture']>;
  etat: FormControl<ResetPasswordFormRawValue['etat']>;
  effectif: FormControl<ResetPasswordFormRawValue['effectif']>;
};

export type ResetPasswordFormGroup = FormGroup<ResetPasswordFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ResetPasswordFormService {
  createResetPasswordFormGroup(resetPassword?: ResetPasswordFormGroupInput): ResetPasswordFormGroup {
    const resetPasswordRawValue = this.convertResetPasswordToResetPasswordRawValue({
      ...this.getFormDefaults(),
      ...(resetPassword ?? { id: null }),
    });
    return new FormGroup<ResetPasswordFormGroupContent>({
      id: new FormControl(
        { value: resetPasswordRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      application: new FormControl(resetPasswordRawValue.application, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      loginWindows: new FormControl(resetPasswordRawValue.loginWindows, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      passwordEncrypted: new FormControl(resetPasswordRawValue.passwordEncrypted, {
        validators: [Validators.required],
      }),
      demandeTidjiId: new FormControl(resetPasswordRawValue.demandeTidjiId, {
        validators: [Validators.maxLength(100)],
      }),
      dateEnvoi: new FormControl(resetPasswordRawValue.dateEnvoi),
      dateCloture: new FormControl(resetPasswordRawValue.dateCloture),
      etat: new FormControl(resetPasswordRawValue.etat, {
        validators: [Validators.maxLength(100)],
      }),
      effectif: new FormControl(resetPasswordRawValue.effectif, {
        validators: [Validators.required],
      }),
    });
  }

  getResetPassword(form: ResetPasswordFormGroup): IResetPassword | NewResetPassword {
    return this.convertResetPasswordRawValueToResetPassword(form.getRawValue() as ResetPasswordFormRawValue | NewResetPasswordFormRawValue);
  }

  resetForm(form: ResetPasswordFormGroup, resetPassword: ResetPasswordFormGroupInput): void {
    const resetPasswordRawValue = this.convertResetPasswordToResetPasswordRawValue({ ...this.getFormDefaults(), ...resetPassword });
    form.reset({
      ...resetPasswordRawValue,
      id: { value: resetPasswordRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ResetPasswordFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateEnvoi: currentTime,
      dateCloture: currentTime,
    };
  }

  private convertResetPasswordRawValueToResetPassword(
    rawResetPassword: ResetPasswordFormRawValue | NewResetPasswordFormRawValue,
  ): IResetPassword | NewResetPassword {
    return {
      ...rawResetPassword,
      dateEnvoi: dayjs(rawResetPassword.dateEnvoi, DATE_TIME_FORMAT),
      dateCloture: dayjs(rawResetPassword.dateCloture, DATE_TIME_FORMAT),
    };
  }

  private convertResetPasswordToResetPasswordRawValue(
    resetPassword: IResetPassword | (Partial<NewResetPassword> & ResetPasswordFormDefaults),
  ): ResetPasswordFormRawValue | PartialWithRequiredKeyOf<NewResetPasswordFormRawValue> {
    return {
      ...resetPassword,
      dateEnvoi: resetPassword.dateEnvoi ? resetPassword.dateEnvoi.format(DATE_TIME_FORMAT) : undefined,
      dateCloture: resetPassword.dateCloture ? resetPassword.dateCloture.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
