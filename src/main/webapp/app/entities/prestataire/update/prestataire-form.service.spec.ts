import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../prestataire.test-samples';

import { PrestataireFormService } from './prestataire-form.service';

describe('Prestataire Form Service', () => {
  let service: PrestataireFormService;

  beforeEach(() => {
    service = TestBed.inject(PrestataireFormService);
  });

  describe('Service methods', () => {
    describe('createPrestataireFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPrestataireFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
          }),
        );
      });

      it('passing IPrestataire should create a new form with FormGroup', () => {
        const formGroup = service.createPrestataireFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
          }),
        );
      });
    });

    describe('getPrestataire', () => {
      it('should return NewPrestataire for default Prestataire initial value', () => {
        const formGroup = service.createPrestataireFormGroup(sampleWithNewData);

        const prestataire = service.getPrestataire(formGroup);

        expect(prestataire).toMatchObject(sampleWithNewData);
      });

      it('should return NewPrestataire for empty Prestataire initial value', () => {
        const formGroup = service.createPrestataireFormGroup();

        const prestataire = service.getPrestataire(formGroup);

        expect(prestataire).toMatchObject({});
      });

      it('should return IPrestataire', () => {
        const formGroup = service.createPrestataireFormGroup(sampleWithRequiredData);

        const prestataire = service.getPrestataire(formGroup);

        expect(prestataire).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPrestataire should not enable id FormControl', () => {
        const formGroup = service.createPrestataireFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPrestataire should disable id FormControl', () => {
        const formGroup = service.createPrestataireFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
