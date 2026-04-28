import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { EffectifService } from 'app/entities/effectif/service/effectif.service';
import { IResetPassword } from 'app/entities/reset-password/reset-password.model';
import { ResetPasswordService } from 'app/entities/reset-password/service/reset-password.service';
import { IEmailTraite } from '../email-traite.model';
import { EmailTraiteService } from '../service/email-traite.service';

import { EmailTraiteFormService } from './email-traite-form.service';
import { EmailTraiteUpdate } from './email-traite-update';

describe('EmailTraite Management Update Component', () => {
  let comp: EmailTraiteUpdate;
  let fixture: ComponentFixture<EmailTraiteUpdate>;
  let activatedRoute: ActivatedRoute;
  let emailTraiteFormService: EmailTraiteFormService;
  let emailTraiteService: EmailTraiteService;
  let effectifService: EffectifService;
  let resetPasswordService: ResetPasswordService;

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

    fixture = TestBed.createComponent(EmailTraiteUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emailTraiteFormService = TestBed.inject(EmailTraiteFormService);
    emailTraiteService = TestBed.inject(EmailTraiteService);
    effectifService = TestBed.inject(EffectifService);
    resetPasswordService = TestBed.inject(ResetPasswordService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Effectif query and add missing value', () => {
      const emailTraite: IEmailTraite = { id: 27530 };
      const effectif: IEffectif = { id: 14359 };
      emailTraite.effectif = effectif;

      const effectifCollection: IEffectif[] = [{ id: 14359 }];
      vitest.spyOn(effectifService, 'query').mockReturnValue(of(new HttpResponse({ body: effectifCollection })));
      const additionalEffectifs = [effectif];
      const expectedCollection: IEffectif[] = [...additionalEffectifs, ...effectifCollection];
      vitest.spyOn(effectifService, 'addEffectifToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emailTraite });
      comp.ngOnInit();

      expect(effectifService.query).toHaveBeenCalled();
      expect(effectifService.addEffectifToCollectionIfMissing).toHaveBeenCalledWith(
        effectifCollection,
        ...additionalEffectifs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.effectifsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call ResetPassword query and add missing value', () => {
      const emailTraite: IEmailTraite = { id: 27530 };
      const resetPassword: IResetPassword = { id: 13864 };
      emailTraite.resetPassword = resetPassword;

      const resetPasswordCollection: IResetPassword[] = [{ id: 13864 }];
      vitest.spyOn(resetPasswordService, 'query').mockReturnValue(of(new HttpResponse({ body: resetPasswordCollection })));
      const additionalResetPasswords = [resetPassword];
      const expectedCollection: IResetPassword[] = [...additionalResetPasswords, ...resetPasswordCollection];
      vitest.spyOn(resetPasswordService, 'addResetPasswordToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emailTraite });
      comp.ngOnInit();

      expect(resetPasswordService.query).toHaveBeenCalled();
      expect(resetPasswordService.addResetPasswordToCollectionIfMissing).toHaveBeenCalledWith(
        resetPasswordCollection,
        ...additionalResetPasswords.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.resetPasswordsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const emailTraite: IEmailTraite = { id: 27530 };
      const effectif: IEffectif = { id: 14359 };
      emailTraite.effectif = effectif;
      const resetPassword: IResetPassword = { id: 13864 };
      emailTraite.resetPassword = resetPassword;

      activatedRoute.data = of({ emailTraite });
      comp.ngOnInit();

      expect(comp.effectifsSharedCollection()).toContainEqual(effectif);
      expect(comp.resetPasswordsSharedCollection()).toContainEqual(resetPassword);
      expect(comp.emailTraite).toEqual(emailTraite);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEmailTraite>();
      const emailTraite = { id: 18838 };
      vitest.spyOn(emailTraiteFormService, 'getEmailTraite').mockReturnValue(emailTraite);
      vitest.spyOn(emailTraiteService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emailTraite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(emailTraite);
      saveSubject.complete();

      // THEN
      expect(emailTraiteFormService.getEmailTraite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emailTraiteService.update).toHaveBeenCalledWith(expect.objectContaining(emailTraite));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEmailTraite>();
      const emailTraite = { id: 18838 };
      vitest.spyOn(emailTraiteFormService, 'getEmailTraite').mockReturnValue({ id: null });
      vitest.spyOn(emailTraiteService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emailTraite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(emailTraite);
      saveSubject.complete();

      // THEN
      expect(emailTraiteFormService.getEmailTraite).toHaveBeenCalled();
      expect(emailTraiteService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IEmailTraite>();
      const emailTraite = { id: 18838 };
      vitest.spyOn(emailTraiteService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emailTraite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emailTraiteService.update).toHaveBeenCalled();
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

    describe('compareResetPassword', () => {
      it('should forward to resetPasswordService', () => {
        const entity = { id: 13864 };
        const entity2 = { id: 22117 };
        vitest.spyOn(resetPasswordService, 'compareResetPassword');
        comp.compareResetPassword(entity, entity2);
        expect(resetPasswordService.compareResetPassword).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
