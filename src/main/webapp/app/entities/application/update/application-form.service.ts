import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IApplication, NewApplication } from '../application.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplication for edit and NewApplicationFormGroupInput for create.
 */
type ApplicationFormGroupInput = IApplication | PartialWithRequiredKeyOf<NewApplication>;

type ApplicationFormDefaults = Pick<NewApplication, 'id'>;

type ApplicationFormGroupContent = {
  id: FormControl<IApplication['id'] | NewApplication['id']>;
  nom: FormControl<IApplication['nom']>;
};

export type ApplicationFormGroup = FormGroup<ApplicationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationFormService {
  createApplicationFormGroup(application?: ApplicationFormGroupInput): ApplicationFormGroup {
    const applicationRawValue = {
      ...this.getFormDefaults(),
      ...(application ?? { id: null }),
    };
    return new FormGroup<ApplicationFormGroupContent>({
      id: new FormControl(
        { value: applicationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(applicationRawValue.nom, {
        validators: [Validators.maxLength(150)],
      }),
    });
  }

  getApplication(form: ApplicationFormGroup): IApplication | NewApplication {
    return form.getRawValue() as IApplication | NewApplication;
  }

  resetForm(form: ApplicationFormGroup, application: ApplicationFormGroupInput): void {
    const applicationRawValue = { ...this.getFormDefaults(), ...application };
    form.reset({
      ...applicationRawValue,
      id: { value: applicationRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ApplicationFormDefaults {
    return {
      id: null,
    };
  }
}
