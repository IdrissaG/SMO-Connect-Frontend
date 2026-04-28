import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../effectif.test-samples';

import { EffectifFormService } from './effectif-form.service';

describe('Effectif Form Service', () => {
  let service: EffectifFormService;

  beforeEach(() => {
    service = TestBed.inject(EffectifFormService);
  });

  describe('Service methods', () => {
    describe('createEffectifFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEffectifFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            email: expect.any(Object),
            mobile: expect.any(Object),
            cni: expect.any(Object),
            genre: expect.any(Object),
            matricule: expect.any(Object),
            matriculeNPlus1: expect.any(Object),
            cuid: expect.any(Object),
            loginReferenceSelfservice: expect.any(Object),
            typeContrat: expect.any(Object),
            typeCompte: expect.any(Object),
            fonction: expect.any(Object),
            profil: expect.any(Object),
            departement: expect.any(Object),
            siteProduction: expect.any(Object),
            vague: expect.any(Object),
            dateRemontee: expect.any(Object),
            dateDemarrageFormation: expect.any(Object),
            dateEntreeProd: expect.any(Object),
            dateSortie: expect.any(Object),
            dateReintegration: expect.any(Object),
            actif: expect.any(Object),
            nouveauAgent: expect.any(Object),
            envoyeTidjiCreation: expect.any(Object),
            dateEnvoyeTidjiCreation: expect.any(Object),
            envoyeTidjiReset: expect.any(Object),
            envoyeTidjiReactivation: expect.any(Object),
            dateEnvoyeTidjiReactivation: expect.any(Object),
            envoyeTidjiModification: expect.any(Object),
            dateEnvoyeTidjiModification: expect.any(Object),
            prestataire: expect.any(Object),
            plateau: expect.any(Object),
          }),
        );
      });

      it('passing IEffectif should create a new form with FormGroup', () => {
        const formGroup = service.createEffectifFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            email: expect.any(Object),
            mobile: expect.any(Object),
            cni: expect.any(Object),
            genre: expect.any(Object),
            matricule: expect.any(Object),
            matriculeNPlus1: expect.any(Object),
            cuid: expect.any(Object),
            loginReferenceSelfservice: expect.any(Object),
            typeContrat: expect.any(Object),
            typeCompte: expect.any(Object),
            fonction: expect.any(Object),
            profil: expect.any(Object),
            departement: expect.any(Object),
            siteProduction: expect.any(Object),
            vague: expect.any(Object),
            dateRemontee: expect.any(Object),
            dateDemarrageFormation: expect.any(Object),
            dateEntreeProd: expect.any(Object),
            dateSortie: expect.any(Object),
            dateReintegration: expect.any(Object),
            actif: expect.any(Object),
            nouveauAgent: expect.any(Object),
            envoyeTidjiCreation: expect.any(Object),
            dateEnvoyeTidjiCreation: expect.any(Object),
            envoyeTidjiReset: expect.any(Object),
            envoyeTidjiReactivation: expect.any(Object),
            dateEnvoyeTidjiReactivation: expect.any(Object),
            envoyeTidjiModification: expect.any(Object),
            dateEnvoyeTidjiModification: expect.any(Object),
            prestataire: expect.any(Object),
            plateau: expect.any(Object),
          }),
        );
      });
    });

    describe('getEffectif', () => {
      it('should return NewEffectif for default Effectif initial value', () => {
        const formGroup = service.createEffectifFormGroup(sampleWithNewData);

        const effectif = service.getEffectif(formGroup);

        expect(effectif).toMatchObject(sampleWithNewData);
      });

      it('should return NewEffectif for empty Effectif initial value', () => {
        const formGroup = service.createEffectifFormGroup();

        const effectif = service.getEffectif(formGroup);

        expect(effectif).toMatchObject({});
      });

      it('should return IEffectif', () => {
        const formGroup = service.createEffectifFormGroup(sampleWithRequiredData);

        const effectif = service.getEffectif(formGroup);

        expect(effectif).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEffectif should not enable id FormControl', () => {
        const formGroup = service.createEffectifFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEffectif should disable id FormControl', () => {
        const formGroup = service.createEffectifFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
