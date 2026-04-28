import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPrestataire, NewPrestataire } from '../prestataire.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPrestataire for edit and NewPrestataireFormGroupInput for create.
 */
type PrestataireFormGroupInput = IPrestataire | PartialWithRequiredKeyOf<NewPrestataire>;

type PrestataireFormDefaults = Pick<NewPrestataire, 'id'>;

type PrestataireFormGroupContent = {
  id: FormControl<IPrestataire['id'] | NewPrestataire['id']>;
  nom: FormControl<IPrestataire['nom']>;
};

export type PrestataireFormGroup = FormGroup<PrestataireFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PrestataireFormService {
  createPrestataireFormGroup(prestataire?: PrestataireFormGroupInput): PrestataireFormGroup {
    const prestataireRawValue = {
      ...this.getFormDefaults(),
      ...(prestataire ?? { id: null }),
    };
    return new FormGroup<PrestataireFormGroupContent>({
      id: new FormControl(
        { value: prestataireRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(prestataireRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
    });
  }

  getPrestataire(form: PrestataireFormGroup): IPrestataire | NewPrestataire {
    return form.getRawValue() as IPrestataire | NewPrestataire;
  }

  resetForm(form: PrestataireFormGroup, prestataire: PrestataireFormGroupInput): void {
    const prestataireRawValue = { ...this.getFormDefaults(), ...prestataire };
    form.reset({
      ...prestataireRawValue,
      id: { value: prestataireRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PrestataireFormDefaults {
    return {
      id: null,
    };
  }
}
