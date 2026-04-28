import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDemande, NewDemande } from '../demande.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDemande for edit and NewDemandeFormGroupInput for create.
 */
type DemandeFormGroupInput = IDemande | PartialWithRequiredKeyOf<NewDemande>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDemande | NewDemande> = Omit<T, 'dateCreation' | 'dateCloture'> & {
  dateCreation?: string | null;
  dateCloture?: string | null;
};

type DemandeFormRawValue = FormValueOf<IDemande>;

type NewDemandeFormRawValue = FormValueOf<NewDemande>;

type DemandeFormDefaults = Pick<NewDemande, 'id' | 'dateCreation' | 'dateCloture'>;

type DemandeFormGroupContent = {
  id: FormControl<DemandeFormRawValue['id'] | NewDemande['id']>;
  type: FormControl<DemandeFormRawValue['type']>;
  statut: FormControl<DemandeFormRawValue['statut']>;
  dateCreation: FormControl<DemandeFormRawValue['dateCreation']>;
  dateCloture: FormControl<DemandeFormRawValue['dateCloture']>;
  typeSla: FormControl<DemandeFormRawValue['typeSla']>;
};

export type DemandeFormGroup = FormGroup<DemandeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DemandeFormService {
  createDemandeFormGroup(demande?: DemandeFormGroupInput): DemandeFormGroup {
    const demandeRawValue = this.convertDemandeToDemandeRawValue({
      ...this.getFormDefaults(),
      ...(demande ?? { id: null }),
    });
    return new FormGroup<DemandeFormGroupContent>({
      id: new FormControl(
        { value: demandeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(demandeRawValue.type, {
        validators: [Validators.required],
      }),
      statut: new FormControl(demandeRawValue.statut, {
        validators: [Validators.required],
      }),
      dateCreation: new FormControl(demandeRawValue.dateCreation, {
        validators: [Validators.required],
      }),
      dateCloture: new FormControl(demandeRawValue.dateCloture),
      typeSla: new FormControl(demandeRawValue.typeSla, {
        validators: [Validators.maxLength(100)],
      }),
    });
  }

  getDemande(form: DemandeFormGroup): IDemande | NewDemande {
    return this.convertDemandeRawValueToDemande(form.getRawValue() as DemandeFormRawValue | NewDemandeFormRawValue);
  }

  resetForm(form: DemandeFormGroup, demande: DemandeFormGroupInput): void {
    const demandeRawValue = this.convertDemandeToDemandeRawValue({ ...this.getFormDefaults(), ...demande });
    form.reset({
      ...demandeRawValue,
      id: { value: demandeRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): DemandeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateCreation: currentTime,
      dateCloture: currentTime,
    };
  }

  private convertDemandeRawValueToDemande(rawDemande: DemandeFormRawValue | NewDemandeFormRawValue): IDemande | NewDemande {
    return {
      ...rawDemande,
      dateCreation: dayjs(rawDemande.dateCreation, DATE_TIME_FORMAT),
      dateCloture: dayjs(rawDemande.dateCloture, DATE_TIME_FORMAT),
    };
  }

  private convertDemandeToDemandeRawValue(
    demande: IDemande | (Partial<NewDemande> & DemandeFormDefaults),
  ): DemandeFormRawValue | PartialWithRequiredKeyOf<NewDemandeFormRawValue> {
    return {
      ...demande,
      dateCreation: demande.dateCreation ? demande.dateCreation.format(DATE_TIME_FORMAT) : undefined,
      dateCloture: demande.dateCloture ? demande.dateCloture.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
