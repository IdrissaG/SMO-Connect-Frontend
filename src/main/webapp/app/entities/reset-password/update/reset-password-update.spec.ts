import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { EffectifService } from 'app/entities/effectif/service/effectif.service';
import { IResetPassword } from '../reset-password.model';
import { ResetPasswordService } from '../service/reset-password.service';

import { ResetPasswordFormService } from './reset-password-form.service';
import { ResetPasswordUpdate } from './reset-password-update';

describe('ResetPassword Management Update Component', () => {
  let comp: ResetPasswordUpdate;
  let fixture: ComponentFixture<ResetPasswordUpdate>;
  let activatedRoute: ActivatedRoute;
  let resetPasswordFormService: ResetPasswordFormService;
  let resetPasswordService: ResetPasswordService;
  let effectifService: EffectifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ResetPasswordUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resetPasswordFormService = TestBed.inject(ResetPasswordFormService);
    resetPasswordService = TestBed.inject(ResetPasswordService);
    effectifService = TestBed.inject(EffectifService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Effectif query and add missing value', () => {
      const resetPassword: IResetPassword = { id: 22117 };
      const effectif: IEffectif = { id: 14359 };
      resetPassword.effectif = effectif;

      const effectifCollection: IEffectif[] = [{ id: 14359 }];
      vitest.spyOn(effectifService, 'query').mockReturnValue(of(new HttpResponse({ body: effectifCollection })));
      const additionalEffectifs = [effectif];
      const expectedCollection: IEffectif[] = [...additionalEffectifs, ...effectifCollection];
      vitest.spyOn(effectifService, 'addEffectifToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resetPassword });
      comp.ngOnInit();

      expect(effectifService.query).toHaveBeenCalled();
      expect(effectifService.addEffectifToCollectionIfMissing).toHaveBeenCalledWith(
        effectifCollection,
        ...additionalEffectifs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.effectifsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const resetPassword: IResetPassword = { id: 22117 };
      const effectif: IEffectif = { id: 14359 };
      resetPassword.effectif = effectif;

      activatedRoute.data = of({ resetPassword });
      comp.ngOnInit();

      expect(comp.effectifsSharedCollection()).toContainEqual(effectif);
      expect(comp.resetPassword).toEqual(resetPassword);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IResetPassword>();
      const resetPassword = { id: 13864 };
      vitest.spyOn(resetPasswordFormService, 'getResetPassword').mockReturnValue(resetPassword);
      vitest.spyOn(resetPasswordService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resetPassword });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(resetPassword);
      saveSubject.complete();

      // THEN
      expect(resetPasswordFormService.getResetPassword).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(resetPasswordService.update).toHaveBeenCalledWith(expect.objectContaining(resetPassword));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IResetPassword>();
      const resetPassword = { id: 13864 };
      vitest.spyOn(resetPasswordFormService, 'getResetPassword').mockReturnValue({ id: null });
      vitest.spyOn(resetPasswordService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resetPassword: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(resetPassword);
      saveSubject.complete();

      // THEN
      expect(resetPasswordFormService.getResetPassword).toHaveBeenCalled();
      expect(resetPasswordService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IResetPassword>();
      const resetPassword = { id: 13864 };
      vitest.spyOn(resetPasswordService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resetPassword });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resetPasswordService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEffectif', () => {
      it('should forward to effectifService', () => {
        const entity = { id: 14359 };
        const entity2 = { id: 9335 };
        vitest.spyOn(effectifService, 'compareEffectif');
        comp.compareEffectif(entity, entity2);
        expect(effectifService.compareEffectif).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
