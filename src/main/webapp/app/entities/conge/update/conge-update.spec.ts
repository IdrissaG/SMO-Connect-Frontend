import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { EffectifService } from 'app/entities/effectif/service/effectif.service';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { IConge } from '../conge.model';
import { CongeService } from '../service/conge.service';

import { CongeFormService } from './conge-form.service';
import { CongeUpdate } from './conge-update';

describe('Conge Management Update Component', () => {
  let comp: CongeUpdate;
  let fixture: ComponentFixture<CongeUpdate>;
  let activatedRoute: ActivatedRoute;
  let congeFormService: CongeFormService;
  let congeService: CongeService;
  let effectifService: EffectifService;
  let userService: UserService;

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

    fixture = TestBed.createComponent(CongeUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    congeFormService = TestBed.inject(CongeFormService);
    congeService = TestBed.inject(CongeService);
    effectifService = TestBed.inject(EffectifService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Effectif query and add missing value', () => {
      const conge: IConge = { id: 27791 };
      const effectif: IEffectif = { id: 14359 };
      conge.effectif = effectif;

      const effectifCollection: IEffectif[] = [{ id: 14359 }];
      vitest.spyOn(effectifService, 'query').mockReturnValue(of(new HttpResponse({ body: effectifCollection })));
      const additionalEffectifs = [effectif];
      const expectedCollection: IEffectif[] = [...additionalEffectifs, ...effectifCollection];
      vitest.spyOn(effectifService, 'addEffectifToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conge });
      comp.ngOnInit();

      expect(effectifService.query).toHaveBeenCalled();
      expect(effectifService.addEffectifToCollectionIfMissing).toHaveBeenCalledWith(
        effectifCollection,
        ...additionalEffectifs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.effectifsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call User query and add missing value', () => {
      const conge: IConge = { id: 27791 };
      const createdBy: IUser = { id: '1344246c-16a7-46d1-bb61-2043f965c8d5' };
      conge.createdBy = createdBy;

      const userCollection: IUser[] = [{ id: '1344246c-16a7-46d1-bb61-2043f965c8d5' }];
      vitest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [createdBy];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      vitest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conge });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.usersSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const conge: IConge = { id: 27791 };
      const effectif: IEffectif = { id: 14359 };
      conge.effectif = effectif;
      const createdBy: IUser = { id: '1344246c-16a7-46d1-bb61-2043f965c8d5' };
      conge.createdBy = createdBy;

      activatedRoute.data = of({ conge });
      comp.ngOnInit();

      expect(comp.effectifsSharedCollection()).toContainEqual(effectif);
      expect(comp.usersSharedCollection()).toContainEqual(createdBy);
      expect(comp.conge).toEqual(conge);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IConge>();
      const conge = { id: 9108 };
      vitest.spyOn(congeFormService, 'getConge').mockReturnValue(conge);
      vitest.spyOn(congeService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conge });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(conge);
      saveSubject.complete();

      // THEN
      expect(congeFormService.getConge).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(congeService.update).toHaveBeenCalledWith(expect.objectContaining(conge));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IConge>();
      const conge = { id: 9108 };
      vitest.spyOn(congeFormService, 'getConge').mockReturnValue({ id: null });
      vitest.spyOn(congeService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conge: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(conge);
      saveSubject.complete();

      // THEN
      expect(congeFormService.getConge).toHaveBeenCalled();
      expect(congeService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IConge>();
      const conge = { id: 9108 };
      vitest.spyOn(congeService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conge });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(congeService.update).toHaveBeenCalled();
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

    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: '1344246c-16a7-46d1-bb61-2043f965c8d5' };
        const entity2 = { id: '1e61df13-b2d3-459d-875e-5607a4ccdbdb' };
        vitest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
