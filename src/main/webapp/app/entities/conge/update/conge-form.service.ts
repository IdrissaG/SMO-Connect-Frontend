import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IConge, NewConge } from '../conge.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConge for edit and NewCongeFormGroupInput for create.
 */
type CongeFormGroupInput = IConge | PartialWithRequiredKeyOf<NewConge>;

type CongeFormDefaults = Pick<NewConge, 'id'>;

type CongeFormGroupContent = {
  id: FormControl<IConge['id'] | NewConge['id']>;
  dateDebut: FormControl<IConge['dateDebut']>;
  dateRetour: FormControl<IConge['dateRetour']>;
  effectif: FormControl<IConge['effectif']>;
  createdBy: FormControl<IConge['createdBy']>;
};

export type CongeFormGroup = FormGroup<CongeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CongeFormService {
  createCongeFormGroup(conge?: CongeFormGroupInput): CongeFormGroup {
    const congeRawValue = {
      ...this.getFormDefaults(),
      ...(conge ?? { id: null }),
    };
    return new FormGroup<CongeFormGroupContent>({
      id: new FormControl(
        { value: congeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dateDebut: new FormControl(congeRawValue.dateDebut, {
        validators: [Validators.required],
      }),
      dateRetour: new FormControl(congeRawValue.dateRetour, {
        validators: [Validators.required],
      }),
      effectif: new FormControl(congeRawValue.effectif, {
        validators: [Validators.required],
      }),
      createdBy: new FormControl(congeRawValue.createdBy),
    });
  }

  getConge(form: CongeFormGroup): IConge | NewConge {
    return form.getRawValue() as IConge | NewConge;
  }

  resetForm(form: CongeFormGroup, conge: CongeFormGroupInput): void {
    const congeRawValue = { ...this.getFormDefaults(), ...conge };
    form.reset({
      ...congeRawValue,
      id: { value: congeRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): CongeFormDefaults {
    return {
      id: null,
    };
  }
}
