import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPlateau, NewPlateau } from '../plateau.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlateau for edit and NewPlateauFormGroupInput for create.
 */
type PlateauFormGroupInput = IPlateau | PartialWithRequiredKeyOf<NewPlateau>;

type PlateauFormDefaults = Pick<NewPlateau, 'id'>;

type PlateauFormGroupContent = {
  id: FormControl<IPlateau['id'] | NewPlateau['id']>;
  nom: FormControl<IPlateau['nom']>;
  prestataire: FormControl<IPlateau['prestataire']>;
};

export type PlateauFormGroup = FormGroup<PlateauFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlateauFormService {
  createPlateauFormGroup(plateau?: PlateauFormGroupInput): PlateauFormGroup {
    const plateauRawValue = {
      ...this.getFormDefaults(),
      ...(plateau ?? { id: null }),
    };
    return new FormGroup<PlateauFormGroupContent>({
      id: new FormControl(
        { value: plateauRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(plateauRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      prestataire: new FormControl(plateauRawValue.prestataire, {
        validators: [Validators.required],
      }),
    });
  }

  getPlateau(form: PlateauFormGroup): IPlateau | NewPlateau {
    return form.getRawValue() as IPlateau | NewPlateau;
  }

  resetForm(form: PlateauFormGroup, plateau: PlateauFormGroupInput): void {
    const plateauRawValue = { ...this.getFormDefaults(), ...plateau };
    form.reset({
      ...plateauRawValue,
      id: { value: plateauRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PlateauFormDefaults {
    return {
      id: null,
    };
  }
}
