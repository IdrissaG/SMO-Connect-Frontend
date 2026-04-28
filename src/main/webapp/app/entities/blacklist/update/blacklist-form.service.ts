import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBlacklist, NewBlacklist } from '../blacklist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBlacklist for edit and NewBlacklistFormGroupInput for create.
 */
type BlacklistFormGroupInput = IBlacklist | PartialWithRequiredKeyOf<NewBlacklist>;

type BlacklistFormDefaults = Pick<NewBlacklist, 'id' | 'active'>;

type BlacklistFormGroupContent = {
  id: FormControl<IBlacklist['id'] | NewBlacklist['id']>;
  nom: FormControl<IBlacklist['nom']>;
  prenom: FormControl<IBlacklist['prenom']>;
  mobile: FormControl<IBlacklist['mobile']>;
  cni: FormControl<IBlacklist['cni']>;
  email: FormControl<IBlacklist['email']>;
  faute: FormControl<IBlacklist['faute']>;
  commentaire: FormControl<IBlacklist['commentaire']>;
  dateFaits: FormControl<IBlacklist['dateFaits']>;
  dateDetection: FormControl<IBlacklist['dateDetection']>;
  dateRemontee: FormControl<IBlacklist['dateRemontee']>;
  active: FormControl<IBlacklist['active']>;
  prestataire: FormControl<IBlacklist['prestataire']>;
  plateau: FormControl<IBlacklist['plateau']>;
};

export type BlacklistFormGroup = FormGroup<BlacklistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BlacklistFormService {
  createBlacklistFormGroup(blacklist?: BlacklistFormGroupInput): BlacklistFormGroup {
    const blacklistRawValue = {
      ...this.getFormDefaults(),
      ...(blacklist ?? { id: null }),
    };
    return new FormGroup<BlacklistFormGroupContent>({
      id: new FormControl(
        { value: blacklistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(blacklistRawValue.nom, {
        validators: [Validators.maxLength(200)],
      }),
      prenom: new FormControl(blacklistRawValue.prenom, {
        validators: [Validators.maxLength(200)],
      }),
      mobile: new FormControl(blacklistRawValue.mobile, {
        validators: [Validators.maxLength(50)],
      }),
      cni: new FormControl(blacklistRawValue.cni, {
        validators: [Validators.maxLength(200)],
      }),
      email: new FormControl(blacklistRawValue.email, {
        validators: [Validators.maxLength(254)],
      }),
      faute: new FormControl(blacklistRawValue.faute),
      commentaire: new FormControl(blacklistRawValue.commentaire),
      dateFaits: new FormControl(blacklistRawValue.dateFaits),
      dateDetection: new FormControl(blacklistRawValue.dateDetection),
      dateRemontee: new FormControl(blacklistRawValue.dateRemontee),
      active: new FormControl(blacklistRawValue.active, {
        validators: [Validators.required],
      }),
      prestataire: new FormControl(blacklistRawValue.prestataire),
      plateau: new FormControl(blacklistRawValue.plateau),
    });
  }

  getBlacklist(form: BlacklistFormGroup): IBlacklist | NewBlacklist {
    return form.getRawValue() as IBlacklist | NewBlacklist;
  }

  resetForm(form: BlacklistFormGroup, blacklist: BlacklistFormGroupInput): void {
    const blacklistRawValue = { ...this.getFormDefaults(), ...blacklist };
    form.reset({
      ...blacklistRawValue,
      id: { value: blacklistRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): BlacklistFormDefaults {
    return {
      id: null,
      active: false,
    };
  }
}
