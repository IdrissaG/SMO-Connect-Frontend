import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITemplateModel, NewTemplateModel } from '../template-model.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITemplateModel for edit and NewTemplateModelFormGroupInput for create.
 */
type TemplateModelFormGroupInput = ITemplateModel | PartialWithRequiredKeyOf<NewTemplateModel>;

type TemplateModelFormDefaults = Pick<NewTemplateModel, 'id' | 'actif'>;

type TemplateModelFormGroupContent = {
  id: FormControl<ITemplateModel['id'] | NewTemplateModel['id']>;
  nom: FormControl<ITemplateModel['nom']>;
  fichier: FormControl<ITemplateModel['fichier']>;
  actif: FormControl<ITemplateModel['actif']>;
};

export type TemplateModelFormGroup = FormGroup<TemplateModelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TemplateModelFormService {
  createTemplateModelFormGroup(templateModel?: TemplateModelFormGroupInput): TemplateModelFormGroup {
    const templateModelRawValue = {
      ...this.getFormDefaults(),
      ...(templateModel ?? { id: null }),
    };
    return new FormGroup<TemplateModelFormGroupContent>({
      id: new FormControl(
        { value: templateModelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(templateModelRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      fichier: new FormControl(templateModelRawValue.fichier, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      actif: new FormControl(templateModelRawValue.actif, {
        validators: [Validators.required],
      }),
    });
  }

  getTemplateModel(form: TemplateModelFormGroup): ITemplateModel | NewTemplateModel {
    return form.getRawValue() as ITemplateModel | NewTemplateModel;
  }

  resetForm(form: TemplateModelFormGroup, templateModel: TemplateModelFormGroupInput): void {
    const templateModelRawValue = { ...this.getFormDefaults(), ...templateModel };
    form.reset({
      ...templateModelRawValue,
      id: { value: templateModelRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): TemplateModelFormDefaults {
    return {
      id: null,
      actif: false,
    };
  }
}
