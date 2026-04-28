import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmailTraite, NewEmailTraite } from '../email-traite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmailTraite for edit and NewEmailTraiteFormGroupInput for create.
 */
type EmailTraiteFormGroupInput = IEmailTraite | PartialWithRequiredKeyOf<NewEmailTraite>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmailTraite | NewEmailTraite> = Omit<T, 'dateReception'> & {
  dateReception?: string | null;
};

type EmailTraiteFormRawValue = FormValueOf<IEmailTraite>;

type NewEmailTraiteFormRawValue = FormValueOf<NewEmailTraite>;

type EmailTraiteFormDefaults = Pick<NewEmailTraite, 'id' | 'dateReception' | 'traiteAvecSucces'>;

type EmailTraiteFormGroupContent = {
  id: FormControl<EmailTraiteFormRawValue['id'] | NewEmailTraite['id']>;
  messageId: FormControl<EmailTraiteFormRawValue['messageId']>;
  dateReception: FormControl<EmailTraiteFormRawValue['dateReception']>;
  nomExtrait: FormControl<EmailTraiteFormRawValue['nomExtrait']>;
  prenomExtrait: FormControl<EmailTraiteFormRawValue['prenomExtrait']>;
  applicationExtrait: FormControl<EmailTraiteFormRawValue['applicationExtrait']>;
  loginExtrait: FormControl<EmailTraiteFormRawValue['loginExtrait']>;
  traiteAvecSucces: FormControl<EmailTraiteFormRawValue['traiteAvecSucces']>;
  erreur: FormControl<EmailTraiteFormRawValue['erreur']>;
  effectif: FormControl<EmailTraiteFormRawValue['effectif']>;
  resetPassword: FormControl<EmailTraiteFormRawValue['resetPassword']>;
};

export type EmailTraiteFormGroup = FormGroup<EmailTraiteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmailTraiteFormService {
  createEmailTraiteFormGroup(emailTraite?: EmailTraiteFormGroupInput): EmailTraiteFormGroup {
    const emailTraiteRawValue = this.convertEmailTraiteToEmailTraiteRawValue({
      ...this.getFormDefaults(),
      ...(emailTraite ?? { id: null }),
    });
    return new FormGroup<EmailTraiteFormGroupContent>({
      id: new FormControl(
        { value: emailTraiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      messageId: new FormControl(emailTraiteRawValue.messageId, {
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      dateReception: new FormControl(emailTraiteRawValue.dateReception, {
        validators: [Validators.required],
      }),
      nomExtrait: new FormControl(emailTraiteRawValue.nomExtrait, {
        validators: [Validators.maxLength(200)],
      }),
      prenomExtrait: new FormControl(emailTraiteRawValue.prenomExtrait, {
        validators: [Validators.maxLength(200)],
      }),
      applicationExtrait: new FormControl(emailTraiteRawValue.applicationExtrait, {
        validators: [Validators.maxLength(100)],
      }),
      loginExtrait: new FormControl(emailTraiteRawValue.loginExtrait, {
        validators: [Validators.maxLength(200)],
      }),
      traiteAvecSucces: new FormControl(emailTraiteRawValue.traiteAvecSucces, {
        validators: [Validators.required],
      }),
      erreur: new FormControl(emailTraiteRawValue.erreur),
      effectif: new FormControl(emailTraiteRawValue.effectif),
      resetPassword: new FormControl(emailTraiteRawValue.resetPassword),
    });
  }

  getEmailTraite(form: EmailTraiteFormGroup): IEmailTraite | NewEmailTraite {
    return this.convertEmailTraiteRawValueToEmailTraite(form.getRawValue() as EmailTraiteFormRawValue | NewEmailTraiteFormRawValue);
  }

  resetForm(form: EmailTraiteFormGroup, emailTraite: EmailTraiteFormGroupInput): void {
    const emailTraiteRawValue = this.convertEmailTraiteToEmailTraiteRawValue({ ...this.getFormDefaults(), ...emailTraite });
    form.reset({
      ...emailTraiteRawValue,
      id: { value: emailTraiteRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): EmailTraiteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateReception: currentTime,
      traiteAvecSucces: false,
    };
  }

  private convertEmailTraiteRawValueToEmailTraite(
    rawEmailTraite: EmailTraiteFormRawValue | NewEmailTraiteFormRawValue,
  ): IEmailTraite | NewEmailTraite {
    return {
      ...rawEmailTraite,
      dateReception: dayjs(rawEmailTraite.dateReception, DATE_TIME_FORMAT),
    };
  }

  private convertEmailTraiteToEmailTraiteRawValue(
    emailTraite: IEmailTraite | (Partial<NewEmailTraite> & EmailTraiteFormDefaults),
  ): EmailTraiteFormRawValue | PartialWithRequiredKeyOf<NewEmailTraiteFormRawValue> {
    return {
      ...emailTraite,
      dateReception: emailTraite.dateReception ? emailTraite.dateReception.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
