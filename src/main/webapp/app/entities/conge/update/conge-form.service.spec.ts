import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../conge.test-samples';

import { CongeFormService } from './conge-form.service';

describe('Conge Form Service', () => {
  let service: CongeFormService;

  beforeEach(() => {
    service = TestBed.inject(CongeFormService);
  });

  describe('Service methods', () => {
    describe('createCongeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCongeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateDebut: expect.any(Object),
            dateRetour: expect.any(Object),
            effectif: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });

      it('passing IConge should create a new form with FormGroup', () => {
        const formGroup = service.createCongeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateDebut: expect.any(Object),
            dateRetour: expect.any(Object),
            effectif: expect.any(Object),
            createdBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getConge', () => {
      it('should return NewConge for default Conge initial value', () => {
        const formGroup = service.createCongeFormGroup(sampleWithNewData);

        const conge = service.getConge(formGroup);

        expect(conge).toMatchObject(sampleWithNewData);
      });

      it('should return NewConge for empty Conge initial value', () => {
        const formGroup = service.createCongeFormGroup();

        const conge = service.getConge(formGroup);

        expect(conge).toMatchObject({});
      });

      it('should return IConge', () => {
        const formGroup = service.createCongeFormGroup(sampleWithRequiredData);

        const conge = service.getConge(formGroup);

        expect(conge).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConge should not enable id FormControl', () => {
        const formGroup = service.createCongeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConge should disable id FormControl', () => {
        const formGroup = service.createCongeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
