import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../template-model.test-samples';

import { TemplateModelFormService } from './template-model-form.service';

describe('TemplateModel Form Service', () => {
  let service: TemplateModelFormService;

  beforeEach(() => {
    service = TestBed.inject(TemplateModelFormService);
  });

  describe('Service methods', () => {
    describe('createTemplateModelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTemplateModelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            fichier: expect.any(Object),
            actif: expect.any(Object),
          }),
        );
      });

      it('passing ITemplateModel should create a new form with FormGroup', () => {
        const formGroup = service.createTemplateModelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            fichier: expect.any(Object),
            actif: expect.any(Object),
          }),
        );
      });
    });

    describe('getTemplateModel', () => {
      it('should return NewTemplateModel for default TemplateModel initial value', () => {
        const formGroup = service.createTemplateModelFormGroup(sampleWithNewData);

        const templateModel = service.getTemplateModel(formGroup);

        expect(templateModel).toMatchObject(sampleWithNewData);
      });

      it('should return NewTemplateModel for empty TemplateModel initial value', () => {
        const formGroup = service.createTemplateModelFormGroup();

        const templateModel = service.getTemplateModel(formGroup);

        expect(templateModel).toMatchObject({});
      });

      it('should return ITemplateModel', () => {
        const formGroup = service.createTemplateModelFormGroup(sampleWithRequiredData);

        const templateModel = service.getTemplateModel(formGroup);

        expect(templateModel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITemplateModel should not enable id FormControl', () => {
        const formGroup = service.createTemplateModelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTemplateModel should disable id FormControl', () => {
        const formGroup = service.createTemplateModelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
