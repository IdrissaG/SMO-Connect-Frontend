import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../blacklist.test-samples';

import { BlacklistFormService } from './blacklist-form.service';

describe('Blacklist Form Service', () => {
  let service: BlacklistFormService;

  beforeEach(() => {
    service = TestBed.inject(BlacklistFormService);
  });

  describe('Service methods', () => {
    describe('createBlacklistFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBlacklistFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            mobile: expect.any(Object),
            cni: expect.any(Object),
            email: expect.any(Object),
            faute: expect.any(Object),
            commentaire: expect.any(Object),
            dateFaits: expect.any(Object),
            dateDetection: expect.any(Object),
            dateRemontee: expect.any(Object),
            active: expect.any(Object),
            prestataire: expect.any(Object),
            plateau: expect.any(Object),
          }),
        );
      });

      it('passing IBlacklist should create a new form with FormGroup', () => {
        const formGroup = service.createBlacklistFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            mobile: expect.any(Object),
            cni: expect.any(Object),
            email: expect.any(Object),
            faute: expect.any(Object),
            commentaire: expect.any(Object),
            dateFaits: expect.any(Object),
            dateDetection: expect.any(Object),
            dateRemontee: expect.any(Object),
            active: expect.any(Object),
            prestataire: expect.any(Object),
            plateau: expect.any(Object),
          }),
        );
      });
    });

    describe('getBlacklist', () => {
      it('should return NewBlacklist for default Blacklist initial value', () => {
        const formGroup = service.createBlacklistFormGroup(sampleWithNewData);

        const blacklist = service.getBlacklist(formGroup);

        expect(blacklist).toMatchObject(sampleWithNewData);
      });

      it('should return NewBlacklist for empty Blacklist initial value', () => {
        const formGroup = service.createBlacklistFormGroup();

        const blacklist = service.getBlacklist(formGroup);

        expect(blacklist).toMatchObject({});
      });

      it('should return IBlacklist', () => {
        const formGroup = service.createBlacklistFormGroup(sampleWithRequiredData);

        const blacklist = service.getBlacklist(formGroup);

        expect(blacklist).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBlacklist should not enable id FormControl', () => {
        const formGroup = service.createBlacklistFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBlacklist should disable id FormControl', () => {
        const formGroup = service.createBlacklistFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
