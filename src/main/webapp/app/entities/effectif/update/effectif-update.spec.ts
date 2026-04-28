import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';
import { IPrestataire } from 'app/entities/prestataire/prestataire.model';
import { PrestataireService } from 'app/entities/prestataire/service/prestataire.service';
import { IEffectif } from '../effectif.model';
import { EffectifService } from '../service/effectif.service';

import { EffectifFormService } from './effectif-form.service';
import { EffectifUpdate } from './effectif-update';

describe('Effectif Management Update Component', () => {
  let comp: EffectifUpdate;
  let fixture: ComponentFixture<EffectifUpdate>;
  let activatedRoute: ActivatedRoute;
  let effectifFormService: EffectifFormService;
  let effectifService: EffectifService;
  let prestataireService: PrestataireService;
  let plateauService: PlateauService;

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

    fixture = TestBed.createComponent(EffectifUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    effectifFormService = TestBed.inject(EffectifFormService);
    effectifService = TestBed.inject(EffectifService);
    prestataireService = TestBed.inject(PrestataireService);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Prestataire query and add missing value', () => {
      const effectif: IEffectif = { id: 9335 };
      const prestataire: IPrestataire = { id: 27618 };
      effectif.prestataire = prestataire;

      const prestataireCollection: IPrestataire[] = [{ id: 27618 }];
      vitest.spyOn(prestataireService, 'query').mockReturnValue(of(new HttpResponse({ body: prestataireCollection })));
      const additionalPrestataires = [prestataire];
      const expectedCollection: IPrestataire[] = [...additionalPrestataires, ...prestataireCollection];
      vitest.spyOn(prestataireService, 'addPrestataireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ effectif });
      comp.ngOnInit();

      expect(prestataireService.query).toHaveBeenCalled();
      expect(prestataireService.addPrestataireToCollectionIfMissing).toHaveBeenCalledWith(
        prestataireCollection,
        ...additionalPrestataires.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.prestatairesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Plateau query and add missing value', () => {
      const effectif: IEffectif = { id: 9335 };
      const plateau: IPlateau = { id: 29046 };
      effectif.plateau = plateau;

      const plateauCollection: IPlateau[] = [{ id: 29046 }];
      vitest.spyOn(plateauService, 'query').mockReturnValue(of(new HttpResponse({ body: plateauCollection })));
      const additionalPlateaus = [plateau];
      const expectedCollection: IPlateau[] = [...additionalPlateaus, ...plateauCollection];
      vitest.spyOn(plateauService, 'addPlateauToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ effectif });
      comp.ngOnInit();

      expect(plateauService.query).toHaveBeenCalled();
      expect(plateauService.addPlateauToCollectionIfMissing).toHaveBeenCalledWith(
        plateauCollection,
        ...additionalPlateaus.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.plateausSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const effectif: IEffectif = { id: 9335 };
      const prestataire: IPrestataire = { id: 27618 };
      effectif.prestataire = prestataire;
      const plateau: IPlateau = { id: 29046 };
      effectif.plateau = plateau;

      activatedRoute.data = of({ effectif });
      comp.ngOnInit();

      expect(comp.prestatairesSharedCollection()).toContainEqual(prestataire);
      expect(comp.plateausSharedCollection()).toContainEqual(plateau);
      expect(comp.effectif).toEqual(effectif);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEffectif>();
      const effectif = { id: 14359 };
      vitest.spyOn(effectifFormService, 'getEffectif').mockReturnValue(effectif);
      vitest.spyOn(effectifService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ effectif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(effectif);
      saveSubject.complete();

      // THEN
      expect(effectifFormService.getEffectif).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(effectifService.update).toHaveBeenCalledWith(expect.objectContaining(effectif));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEffectif>();
      const effectif = { id: 14359 };
      vitest.spyOn(effectifFormService, 'getEffectif').mockReturnValue({ id: null });
      vitest.spyOn(effectifService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ effectif: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(effectif);
      saveSubject.complete();

      // THEN
      expect(effectifFormService.getEffectif).toHaveBeenCalled();
      expect(effectifService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IEffectif>();
      const effectif = { id: 14359 };
      vitest.spyOn(effectifService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ effectif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(effectifService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePrestataire', () => {
      it('should forward to prestataireService', () => {
        const entity = { id: 27618 };
        const entity2 = { id: 28861 };
        vitest.spyOn(prestataireService, 'comparePrestataire');
        comp.comparePrestataire(entity, entity2);
        expect(prestataireService.comparePrestataire).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePlateau', () => {
      it('should forward to plateauService', () => {
        const entity = { id: 29046 };
        const entity2 = { id: 16316 };
        vitest.spyOn(plateauService, 'comparePlateau');
        comp.comparePlateau(entity, entity2);
        expect(plateauService.comparePlateau).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
