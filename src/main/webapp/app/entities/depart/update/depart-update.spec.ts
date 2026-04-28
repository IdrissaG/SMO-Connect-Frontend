import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IEffectif } from 'app/entities/effectif/effectif.model';
import { EffectifService } from 'app/entities/effectif/service/effectif.service';
import { IDepart } from '../depart.model';
import { DepartService } from '../service/depart.service';

import { DepartFormService } from './depart-form.service';
import { DepartUpdate } from './depart-update';

describe('Depart Management Update Component', () => {
  let comp: DepartUpdate;
  let fixture: ComponentFixture<DepartUpdate>;
  let activatedRoute: ActivatedRoute;
  let departFormService: DepartFormService;
  let departService: DepartService;
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

    fixture = TestBed.createComponent(DepartUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departFormService = TestBed.inject(DepartFormService);
    departService = TestBed.inject(DepartService);
    effectifService = TestBed.inject(EffectifService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Effectif query and add missing value', () => {
      const depart: IDepart = { id: 16150 };
      const effectif: IEffectif = { id: 14359 };
      depart.effectif = effectif;

      const effectifCollection: IEffectif[] = [{ id: 14359 }];
      vitest.spyOn(effectifService, 'query').mockReturnValue(of(new HttpResponse({ body: effectifCollection })));
      const additionalEffectifs = [effectif];
      const expectedCollection: IEffectif[] = [...additionalEffectifs, ...effectifCollection];
      vitest.spyOn(effectifService, 'addEffectifToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ depart });
      comp.ngOnInit();

      expect(effectifService.query).toHaveBeenCalled();
      expect(effectifService.addEffectifToCollectionIfMissing).toHaveBeenCalledWith(
        effectifCollection,
        ...additionalEffectifs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.effectifsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const depart: IDepart = { id: 16150 };
      const effectif: IEffectif = { id: 14359 };
      depart.effectif = effectif;

      activatedRoute.data = of({ depart });
      comp.ngOnInit();

      expect(comp.effectifsSharedCollection()).toContainEqual(effectif);
      expect(comp.depart).toEqual(depart);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDepart>();
      const depart = { id: 1161 };
      vitest.spyOn(departFormService, 'getDepart').mockReturnValue(depart);
      vitest.spyOn(departService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ depart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(depart);
      saveSubject.complete();

      // THEN
      expect(departFormService.getDepart).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departService.update).toHaveBeenCalledWith(expect.objectContaining(depart));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDepart>();
      const depart = { id: 1161 };
      vitest.spyOn(departFormService, 'getDepart').mockReturnValue({ id: null });
      vitest.spyOn(departService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ depart: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(depart);
      saveSubject.complete();

      // THEN
      expect(departFormService.getDepart).toHaveBeenCalled();
      expect(departService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IDepart>();
      const depart = { id: 1161 };
      vitest.spyOn(departService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ depart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departService.update).toHaveBeenCalled();
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
