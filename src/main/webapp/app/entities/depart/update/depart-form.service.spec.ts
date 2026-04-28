import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../depart.test-samples';

import { DepartFormService } from './depart-form.service';

describe('Depart Form Service', () => {
  let service: DepartFormService;

  beforeEach(() => {
    service = TestBed.inject(DepartFormService);
  });

  describe('Service methods', () => {
    describe('createDepartFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDepartFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateDepart: expect.any(Object),
            motifDepart: expect.any(Object),
            desistementFormation: expect.any(Object),
            dateRemontee: expect.any(Object),
            envoyeTidji: expect.any(Object),
            effectif: expect.any(Object),
          }),
        );
      });

      it('passing IDepart should create a new form with FormGroup', () => {
        const formGroup = service.createDepartFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateDepart: expect.any(Object),
            motifDepart: expect.any(Object),
            desistementFormation: expect.any(Object),
            dateRemontee: expect.any(Object),
            envoyeTidji: expect.any(Object),
            effectif: expect.any(Object),
          }),
        );
      });
    });

    describe('getDepart', () => {
      it('should return NewDepart for default Depart initial value', () => {
        const formGroup = service.createDepartFormGroup(sampleWithNewData);

        const depart = service.getDepart(formGroup);

        expect(depart).toMatchObject(sampleWithNewData);
      });

      it('should return NewDepart for empty Depart initial value', () => {
        const formGroup = service.createDepartFormGroup();

        const depart = service.getDepart(formGroup);

        expect(depart).toMatchObject({});
      });

      it('should return IDepart', () => {
        const formGroup = service.createDepartFormGroup(sampleWithRequiredData);

        const depart = service.getDepart(formGroup);

        expect(depart).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDepart should not enable id FormControl', () => {
        const formGroup = service.createDepartFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDepart should disable id FormControl', () => {
        const formGroup = service.createDepartFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
