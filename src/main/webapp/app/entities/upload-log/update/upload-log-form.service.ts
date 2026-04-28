import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IUploadLog, NewUploadLog } from '../upload-log.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUploadLog for edit and NewUploadLogFormGroupInput for create.
 */
type UploadLogFormGroupInput = IUploadLog | PartialWithRequiredKeyOf<NewUploadLog>;

type UploadLogFormDefaults = Pick<NewUploadLog, 'id'>;

type UploadLogFormGroupContent = {
  id: FormControl<IUploadLog['id'] | NewUploadLog['id']>;
  typeFichier: FormControl<IUploadLog['typeFichier']>;
  nomFichier: FormControl<IUploadLog['nomFichier']>;
  nombreLignes: FormControl<IUploadLog['nombreLignes']>;
  succesCount: FormControl<IUploadLog['succesCount']>;
  erreurCount: FormControl<IUploadLog['erreurCount']>;
  doublonCount: FormControl<IUploadLog['doublonCount']>;
  entite: FormControl<IUploadLog['entite']>;
};

export type UploadLogFormGroup = FormGroup<UploadLogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UploadLogFormService {
  createUploadLogFormGroup(uploadLog?: UploadLogFormGroupInput): UploadLogFormGroup {
    const uploadLogRawValue = {
      ...this.getFormDefaults(),
      ...(uploadLog ?? { id: null }),
    };
    return new FormGroup<UploadLogFormGroupContent>({
      id: new FormControl(
        { value: uploadLogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      typeFichier: new FormControl(uploadLogRawValue.typeFichier, {
        validators: [Validators.required],
      }),
      nomFichier: new FormControl(uploadLogRawValue.nomFichier, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      nombreLignes: new FormControl(uploadLogRawValue.nombreLignes),
      succesCount: new FormControl(uploadLogRawValue.succesCount),
      erreurCount: new FormControl(uploadLogRawValue.erreurCount),
      doublonCount: new FormControl(uploadLogRawValue.doublonCount),
      entite: new FormControl(uploadLogRawValue.entite, {
        validators: [Validators.maxLength(100)],
      }),
    });
  }

  getUploadLog(form: UploadLogFormGroup): IUploadLog | NewUploadLog {
    return form.getRawValue() as IUploadLog | NewUploadLog;
  }

  resetForm(form: UploadLogFormGroup, uploadLog: UploadLogFormGroupInput): void {
    const uploadLogRawValue = { ...this.getFormDefaults(), ...uploadLog };
    form.reset({
      ...uploadLogRawValue,
      id: { value: uploadLogRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): UploadLogFormDefaults {
    return {
      id: null,
    };
  }
}
