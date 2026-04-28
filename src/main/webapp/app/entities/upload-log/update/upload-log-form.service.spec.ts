import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../upload-log.test-samples';

import { UploadLogFormService } from './upload-log-form.service';

describe('UploadLog Form Service', () => {
  let service: UploadLogFormService;

  beforeEach(() => {
    service = TestBed.inject(UploadLogFormService);
  });

  describe('Service methods', () => {
    describe('createUploadLogFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUploadLogFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typeFichier: expect.any(Object),
            nomFichier: expect.any(Object),
            nombreLignes: expect.any(Object),
            succesCount: expect.any(Object),
            erreurCount: expect.any(Object),
            doublonCount: expect.any(Object),
            entite: expect.any(Object),
          }),
        );
      });

      it('passing IUploadLog should create a new form with FormGroup', () => {
        const formGroup = service.createUploadLogFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typeFichier: expect.any(Object),
            nomFichier: expect.any(Object),
            nombreLignes: expect.any(Object),
            succesCount: expect.any(Object),
            erreurCount: expect.any(Object),
            doublonCount: expect.any(Object),
            entite: expect.any(Object),
          }),
        );
      });
    });

    describe('getUploadLog', () => {
      it('should return NewUploadLog for default UploadLog initial value', () => {
        const formGroup = service.createUploadLogFormGroup(sampleWithNewData);

        const uploadLog = service.getUploadLog(formGroup);

        expect(uploadLog).toMatchObject(sampleWithNewData);
      });

      it('should return NewUploadLog for empty UploadLog initial value', () => {
        const formGroup = service.createUploadLogFormGroup();

        const uploadLog = service.getUploadLog(formGroup);

        expect(uploadLog).toMatchObject({});
      });

      it('should return IUploadLog', () => {
        const formGroup = service.createUploadLogFormGroup(sampleWithRequiredData);

        const uploadLog = service.getUploadLog(formGroup);

        expect(uploadLog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUploadLog should not enable id FormControl', () => {
        const formGroup = service.createUploadLogFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUploadLog should disable id FormControl', () => {
        const formGroup = service.createUploadLogFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
