import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../plateau.test-samples';

import { PlateauFormService } from './plateau-form.service';

describe('Plateau Form Service', () => {
  let service: PlateauFormService;

  beforeEach(() => {
    service = TestBed.inject(PlateauFormService);
  });

  describe('Service methods', () => {
    describe('createPlateauFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlateauFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prestataire: expect.any(Object),
          }),
        );
      });

      it('passing IPlateau should create a new form with FormGroup', () => {
        const formGroup = service.createPlateauFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prestataire: expect.any(Object),
          }),
        );
      });
    });

    describe('getPlateau', () => {
      it('should return NewPlateau for default Plateau initial value', () => {
        const formGroup = service.createPlateauFormGroup(sampleWithNewData);

        const plateau = service.getPlateau(formGroup);

        expect(plateau).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlateau for empty Plateau initial value', () => {
        const formGroup = service.createPlateauFormGroup();

        const plateau = service.getPlateau(formGroup);

        expect(plateau).toMatchObject({});
      });

      it('should return IPlateau', () => {
        const formGroup = service.createPlateauFormGroup(sampleWithRequiredData);

        const plateau = service.getPlateau(formGroup);

        expect(plateau).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlateau should not enable id FormControl', () => {
        const formGroup = service.createPlateauFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlateau should disable id FormControl', () => {
        const formGroup = service.createPlateauFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
