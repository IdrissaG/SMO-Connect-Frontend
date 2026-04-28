import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDepart, NewDepart } from '../depart.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDepart for edit and NewDepartFormGroupInput for create.
 */
type DepartFormGroupInput = IDepart | PartialWithRequiredKeyOf<NewDepart>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDepart | NewDepart> = Omit<T, 'desistementFormation'> & {
  desistementFormation?: string | null;
};

type DepartFormRawValue = FormValueOf<IDepart>;

type NewDepartFormRawValue = FormValueOf<NewDepart>;

type DepartFormDefaults = Pick<NewDepart, 'id' | 'desistementFormation' | 'envoyeTidji'>;

type DepartFormGroupContent = {
  id: FormControl<DepartFormRawValue['id'] | NewDepart['id']>;
  dateDepart: FormControl<DepartFormRawValue['dateDepart']>;
  motifDepart: FormControl<DepartFormRawValue['motifDepart']>;
  desistementFormation: FormControl<DepartFormRawValue['desistementFormation']>;
  dateRemontee: FormControl<DepartFormRawValue['dateRemontee']>;
  envoyeTidji: FormControl<DepartFormRawValue['envoyeTidji']>;
  effectif: FormControl<DepartFormRawValue['effectif']>;
};

export type DepartFormGroup = FormGroup<DepartFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DepartFormService {
  createDepartFormGroup(depart?: DepartFormGroupInput): DepartFormGroup {
    const departRawValue = this.convertDepartToDepartRawValue({
      ...this.getFormDefaults(),
      ...(depart ?? { id: null }),
    });
    return new FormGroup<DepartFormGroupContent>({
      id: new FormControl(
        { value: departRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dateDepart: new FormControl(departRawValue.dateDepart),
      motifDepart: new FormControl(departRawValue.motifDepart),
      desistementFormation: new FormControl(departRawValue.desistementFormation),
      dateRemontee: new FormControl(departRawValue.dateRemontee),
      envoyeTidji: new FormControl(departRawValue.envoyeTidji, {
        validators: [Validators.required],
      }),
      effectif: new FormControl(departRawValue.effectif, {
        validators: [Validators.required],
      }),
    });
  }

  getDepart(form: DepartFormGroup): IDepart | NewDepart {
    return this.convertDepartRawValueToDepart(form.getRawValue() as DepartFormRawValue | NewDepartFormRawValue);
  }

  resetForm(form: DepartFormGroup, depart: DepartFormGroupInput): void {
    const departRawValue = this.convertDepartToDepartRawValue({ ...this.getFormDefaults(), ...depart });
    form.reset({
      ...departRawValue,
      id: { value: departRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): DepartFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      desistementFormation: currentTime,
      envoyeTidji: false,
    };
  }

  private convertDepartRawValueToDepart(rawDepart: DepartFormRawValue | NewDepartFormRawValue): IDepart | NewDepart {
    return {
      ...rawDepart,
      desistementFormation: dayjs(rawDepart.desistementFormation, DATE_TIME_FORMAT),
    };
  }

  private convertDepartToDepartRawValue(
    depart: IDepart | (Partial<NewDepart> & DepartFormDefaults),
  ): DepartFormRawValue | PartialWithRequiredKeyOf<NewDepartFormRawValue> {
    return {
      ...depart,
      desistementFormation: depart.desistementFormation ? depart.desistementFormation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
