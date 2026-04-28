import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../reset-password.test-samples';

import { ResetPasswordFormService } from './reset-password-form.service';

describe('ResetPassword Form Service', () => {
  let service: ResetPasswordFormService;

  beforeEach(() => {
    service = TestBed.inject(ResetPasswordFormService);
  });

  describe('Service methods', () => {
    describe('createResetPasswordFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createResetPasswordFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            application: expect.any(Object),
            loginWindows: expect.any(Object),
            passwordEncrypted: expect.any(Object),
            demandeTidjiId: expect.any(Object),
            dateEnvoi: expect.any(Object),
            dateCloture: expect.any(Object),
            etat: expect.any(Object),
            effectif: expect.any(Object),
          }),
        );
      });

      it('passing IResetPassword should create a new form with FormGroup', () => {
        const formGroup = service.createResetPasswordFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            application: expect.any(Object),
            loginWindows: expect.any(Object),
            passwordEncrypted: expect.any(Object),
            demandeTidjiId: expect.any(Object),
            dateEnvoi: expect.any(Object),
            dateCloture: expect.any(Object),
            etat: expect.any(Object),
            effectif: expect.any(Object),
          }),
        );
      });
    });

    describe('getResetPassword', () => {
      it('should return NewResetPassword for default ResetPassword initial value', () => {
        const formGroup = service.createResetPasswordFormGroup(sampleWithNewData);

        const resetPassword = service.getResetPassword(formGroup);

        expect(resetPassword).toMatchObject(sampleWithNewData);
      });

      it('should return NewResetPassword for empty ResetPassword initial value', () => {
        const formGroup = service.createResetPasswordFormGroup();

        const resetPassword = service.getResetPassword(formGroup);

        expect(resetPassword).toMatchObject({});
      });

      it('should return IResetPassword', () => {
        const formGroup = service.createResetPasswordFormGroup(sampleWithRequiredData);

        const resetPassword = service.getResetPassword(formGroup);

        expect(resetPassword).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IResetPassword should not enable id FormControl', () => {
        const formGroup = service.createResetPasswordFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewResetPassword should disable id FormControl', () => {
        const formGroup = service.createResetPasswordFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
