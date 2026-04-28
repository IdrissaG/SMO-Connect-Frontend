import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEffectif, NewEffectif } from '../effectif.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEffectif for edit and NewEffectifFormGroupInput for create.
 */
type EffectifFormGroupInput = IEffectif | PartialWithRequiredKeyOf<NewEffectif>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEffectif | NewEffectif> = Omit<
  T,
  'dateEnvoyeTidjiCreation' | 'dateEnvoyeTidjiReactivation' | 'dateEnvoyeTidjiModification'
> & {
  dateEnvoyeTidjiCreation?: string | null;
  dateEnvoyeTidjiReactivation?: string | null;
  dateEnvoyeTidjiModification?: string | null;
};

type EffectifFormRawValue = FormValueOf<IEffectif>;

type NewEffectifFormRawValue = FormValueOf<NewEffectif>;

type EffectifFormDefaults = Pick<
  NewEffectif,
  | 'id'
  | 'actif'
  | 'nouveauAgent'
  | 'envoyeTidjiCreation'
  | 'dateEnvoyeTidjiCreation'
  | 'envoyeTidjiReset'
  | 'envoyeTidjiReactivation'
  | 'dateEnvoyeTidjiReactivation'
  | 'envoyeTidjiModification'
  | 'dateEnvoyeTidjiModification'
>;

type EffectifFormGroupContent = {
  id: FormControl<EffectifFormRawValue['id'] | NewEffectif['id']>;
  nom: FormControl<EffectifFormRawValue['nom']>;
  prenom: FormControl<EffectifFormRawValue['prenom']>;
  email: FormControl<EffectifFormRawValue['email']>;
  mobile: FormControl<EffectifFormRawValue['mobile']>;
  cni: FormControl<EffectifFormRawValue['cni']>;
  genre: FormControl<EffectifFormRawValue['genre']>;
  matricule: FormControl<EffectifFormRawValue['matricule']>;
  matriculeNPlus1: FormControl<EffectifFormRawValue['matriculeNPlus1']>;
  cuid: FormControl<EffectifFormRawValue['cuid']>;
  loginReferenceSelfservice: FormControl<EffectifFormRawValue['loginReferenceSelfservice']>;
  typeContrat: FormControl<EffectifFormRawValue['typeContrat']>;
  typeCompte: FormControl<EffectifFormRawValue['typeCompte']>;
  fonction: FormControl<EffectifFormRawValue['fonction']>;
  profil: FormControl<EffectifFormRawValue['profil']>;
  departement: FormControl<EffectifFormRawValue['departement']>;
  siteProduction: FormControl<EffectifFormRawValue['siteProduction']>;
  vague: FormControl<EffectifFormRawValue['vague']>;
  dateRemontee: FormControl<EffectifFormRawValue['dateRemontee']>;
  dateDemarrageFormation: FormControl<EffectifFormRawValue['dateDemarrageFormation']>;
  dateEntreeProd: FormControl<EffectifFormRawValue['dateEntreeProd']>;
  dateSortie: FormControl<EffectifFormRawValue['dateSortie']>;
  dateReintegration: FormControl<EffectifFormRawValue['dateReintegration']>;
  actif: FormControl<EffectifFormRawValue['actif']>;
  nouveauAgent: FormControl<EffectifFormRawValue['nouveauAgent']>;
  envoyeTidjiCreation: FormControl<EffectifFormRawValue['envoyeTidjiCreation']>;
  dateEnvoyeTidjiCreation: FormControl<EffectifFormRawValue['dateEnvoyeTidjiCreation']>;
  envoyeTidjiReset: FormControl<EffectifFormRawValue['envoyeTidjiReset']>;
  envoyeTidjiReactivation: FormControl<EffectifFormRawValue['envoyeTidjiReactivation']>;
  dateEnvoyeTidjiReactivation: FormControl<EffectifFormRawValue['dateEnvoyeTidjiReactivation']>;
  envoyeTidjiModification: FormControl<EffectifFormRawValue['envoyeTidjiModification']>;
  dateEnvoyeTidjiModification: FormControl<EffectifFormRawValue['dateEnvoyeTidjiModification']>;
  prestataire: FormControl<EffectifFormRawValue['prestataire']>;
  plateau: FormControl<EffectifFormRawValue['plateau']>;
};

export type EffectifFormGroup = FormGroup<EffectifFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EffectifFormService {
  createEffectifFormGroup(effectif?: EffectifFormGroupInput): EffectifFormGroup {
    const effectifRawValue = this.convertEffectifToEffectifRawValue({
      ...this.getFormDefaults(),
      ...(effectif ?? { id: null }),
    });
    return new FormGroup<EffectifFormGroupContent>({
      id: new FormControl(
        { value: effectifRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(effectifRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      prenom: new FormControl(effectifRawValue.prenom, {
        validators: [Validators.maxLength(200)],
      }),
      email: new FormControl(effectifRawValue.email, {
        validators: [Validators.maxLength(254)],
      }),
      mobile: new FormControl(effectifRawValue.mobile, {
        validators: [Validators.maxLength(50)],
      }),
      cni: new FormControl(effectifRawValue.cni, {
        validators: [Validators.maxLength(200)],
      }),
      genre: new FormControl(effectifRawValue.genre),
      matricule: new FormControl(effectifRawValue.matricule, {
        validators: [Validators.maxLength(100)],
      }),
      matriculeNPlus1: new FormControl(effectifRawValue.matriculeNPlus1, {
        validators: [Validators.maxLength(100)],
      }),
      cuid: new FormControl(effectifRawValue.cuid, {
        validators: [Validators.maxLength(200)],
      }),
      loginReferenceSelfservice: new FormControl(effectifRawValue.loginReferenceSelfservice, {
        validators: [Validators.maxLength(100)],
      }),
      typeContrat: new FormControl(effectifRawValue.typeContrat),
      typeCompte: new FormControl(effectifRawValue.typeCompte),
      fonction: new FormControl(effectifRawValue.fonction),
      profil: new FormControl(effectifRawValue.profil, {
        validators: [Validators.maxLength(200)],
      }),
      departement: new FormControl(effectifRawValue.departement, {
        validators: [Validators.maxLength(200)],
      }),
      siteProduction: new FormControl(effectifRawValue.siteProduction, {
        validators: [Validators.maxLength(200)],
      }),
      vague: new FormControl(effectifRawValue.vague, {
        validators: [Validators.maxLength(200)],
      }),
      dateRemontee: new FormControl(effectifRawValue.dateRemontee),
      dateDemarrageFormation: new FormControl(effectifRawValue.dateDemarrageFormation),
      dateEntreeProd: new FormControl(effectifRawValue.dateEntreeProd),
      dateSortie: new FormControl(effectifRawValue.dateSortie),
      dateReintegration: new FormControl(effectifRawValue.dateReintegration),
      actif: new FormControl(effectifRawValue.actif, {
        validators: [Validators.required],
      }),
      nouveauAgent: new FormControl(effectifRawValue.nouveauAgent),
      envoyeTidjiCreation: new FormControl(effectifRawValue.envoyeTidjiCreation),
      dateEnvoyeTidjiCreation: new FormControl(effectifRawValue.dateEnvoyeTidjiCreation),
      envoyeTidjiReset: new FormControl(effectifRawValue.envoyeTidjiReset),
      envoyeTidjiReactivation: new FormControl(effectifRawValue.envoyeTidjiReactivation),
      dateEnvoyeTidjiReactivation: new FormControl(effectifRawValue.dateEnvoyeTidjiReactivation),
      envoyeTidjiModification: new FormControl(effectifRawValue.envoyeTidjiModification),
      dateEnvoyeTidjiModification: new FormControl(effectifRawValue.dateEnvoyeTidjiModification),
      prestataire: new FormControl(effectifRawValue.prestataire, {
        validators: [Validators.required],
      }),
      plateau: new FormControl(effectifRawValue.plateau),
    });
  }

  getEffectif(form: EffectifFormGroup): IEffectif | NewEffectif {
    return this.convertEffectifRawValueToEffectif(form.getRawValue() as EffectifFormRawValue | NewEffectifFormRawValue);
  }

  resetForm(form: EffectifFormGroup, effectif: EffectifFormGroupInput): void {
    const effectifRawValue = this.convertEffectifToEffectifRawValue({ ...this.getFormDefaults(), ...effectif });
    form.reset({
      ...effectifRawValue,
      id: { value: effectifRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): EffectifFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      actif: false,
      nouveauAgent: false,
      envoyeTidjiCreation: false,
      dateEnvoyeTidjiCreation: currentTime,
      envoyeTidjiReset: false,
      envoyeTidjiReactivation: false,
      dateEnvoyeTidjiReactivation: currentTime,
      envoyeTidjiModification: false,
      dateEnvoyeTidjiModification: currentTime,
    };
  }

  private convertEffectifRawValueToEffectif(rawEffectif: EffectifFormRawValue | NewEffectifFormRawValue): IEffectif | NewEffectif {
    return {
      ...rawEffectif,
      dateEnvoyeTidjiCreation: dayjs(rawEffectif.dateEnvoyeTidjiCreation, DATE_TIME_FORMAT),
      dateEnvoyeTidjiReactivation: dayjs(rawEffectif.dateEnvoyeTidjiReactivation, DATE_TIME_FORMAT),
      dateEnvoyeTidjiModification: dayjs(rawEffectif.dateEnvoyeTidjiModification, DATE_TIME_FORMAT),
    };
  }

  private convertEffectifToEffectifRawValue(
    effectif: IEffectif | (Partial<NewEffectif> & EffectifFormDefaults),
  ): EffectifFormRawValue | PartialWithRequiredKeyOf<NewEffectifFormRawValue> {
    return {
      ...effectif,
      dateEnvoyeTidjiCreation: effectif.dateEnvoyeTidjiCreation ? effectif.dateEnvoyeTidjiCreation.format(DATE_TIME_FORMAT) : undefined,
      dateEnvoyeTidjiReactivation: effectif.dateEnvoyeTidjiReactivation
        ? effectif.dateEnvoyeTidjiReactivation.format(DATE_TIME_FORMAT)
        : undefined,
      dateEnvoyeTidjiModification: effectif.dateEnvoyeTidjiModification
        ? effectif.dateEnvoyeTidjiModification.format(DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
