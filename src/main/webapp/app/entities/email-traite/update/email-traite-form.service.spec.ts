import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../email-traite.test-samples';

import { EmailTraiteFormService } from './email-traite-form.service';

describe('EmailTraite Form Service', () => {
  let service: EmailTraiteFormService;

  beforeEach(() => {
    service = TestBed.inject(EmailTraiteFormService);
  });

  describe('Service methods', () => {
    describe('createEmailTraiteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmailTraiteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            messageId: expect.any(Object),
            dateReception: expect.any(Object),
            nomExtrait: expect.any(Object),
            prenomExtrait: expect.any(Object),
            applicationExtrait: expect.any(Object),
            loginExtrait: expect.any(Object),
            traiteAvecSucces: expect.any(Object),
            erreur: expect.any(Object),
            effectif: expect.any(Object),
            resetPassword: expect.any(Object),
          }),
        );
      });

      it('passing IEmailTraite should create a new form with FormGroup', () => {
        const formGroup = service.createEmailTraiteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            messageId: expect.any(Object),
            dateReception: expect.any(Object),
            nomExtrait: expect.any(Object),
            prenomExtrait: expect.any(Object),
            applicationExtrait: expect.any(Object),
            loginExtrait: expect.any(Object),
            traiteAvecSucces: expect.any(Object),
            erreur: expect.any(Object),
            effectif: expect.any(Object),
            resetPassword: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmailTraite', () => {
      it('should return NewEmailTraite for default EmailTraite initial value', () => {
        const formGroup = service.createEmailTraiteFormGroup(sampleWithNewData);

        const emailTraite = service.getEmailTraite(formGroup);

        expect(emailTraite).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmailTraite for empty EmailTraite initial value', () => {
        const formGroup = service.createEmailTraiteFormGroup();

        const emailTraite = service.getEmailTraite(formGroup);

        expect(emailTraite).toMatchObject({});
      });

      it('should return IEmailTraite', () => {
        const formGroup = service.createEmailTraiteFormGroup(sampleWithRequiredData);

        const emailTraite = service.getEmailTraite(formGroup);

        expect(emailTraite).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmailTraite should not enable id FormControl', () => {
        const formGroup = service.createEmailTraiteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmailTraite should disable id FormControl', () => {
        const formGroup = service.createEmailTraiteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
