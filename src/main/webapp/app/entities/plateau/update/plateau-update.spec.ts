import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IPrestataire } from 'app/entities/prestataire/prestataire.model';
import { PrestataireService } from 'app/entities/prestataire/service/prestataire.service';
import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';

import { PlateauFormService } from './plateau-form.service';
import { PlateauUpdate } from './plateau-update';

describe('Plateau Management Update Component', () => {
  let comp: PlateauUpdate;
  let fixture: ComponentFixture<PlateauUpdate>;
  let activatedRoute: ActivatedRoute;
  let plateauFormService: PlateauFormService;
  let plateauService: PlateauService;
  let prestataireService: PrestataireService;

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

    fixture = TestBed.createComponent(PlateauUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plateauFormService = TestBed.inject(PlateauFormService);
    plateauService = TestBed.inject(PlateauService);
    prestataireService = TestBed.inject(PrestataireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Prestataire query and add missing value', () => {
      const plateau: IPlateau = { id: 16316 };
      const prestataire: IPrestataire = { id: 27618 };
      plateau.prestataire = prestataire;

      const prestataireCollection: IPrestataire[] = [{ id: 27618 }];
      vitest.spyOn(prestataireService, 'query').mockReturnValue(of(new HttpResponse({ body: prestataireCollection })));
      const additionalPrestataires = [prestataire];
      const expectedCollection: IPrestataire[] = [...additionalPrestataires, ...prestataireCollection];
      vitest.spyOn(prestataireService, 'addPrestataireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      expect(prestataireService.query).toHaveBeenCalled();
      expect(prestataireService.addPrestataireToCollectionIfMissing).toHaveBeenCalledWith(
        prestataireCollection,
        ...additionalPrestataires.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.prestatairesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const plateau: IPlateau = { id: 16316 };
      const prestataire: IPrestataire = { id: 27618 };
      plateau.prestataire = prestataire;

      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      expect(comp.prestatairesSharedCollection()).toContainEqual(prestataire);
      expect(comp.plateau).toEqual(plateau);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPlateau>();
      const plateau = { id: 29046 };
      vitest.spyOn(plateauFormService, 'getPlateau').mockReturnValue(plateau);
      vitest.spyOn(plateauService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(plateau);
      saveSubject.complete();

      // THEN
      expect(plateauFormService.getPlateau).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(plateauService.update).toHaveBeenCalledWith(expect.objectContaining(plateau));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPlateau>();
      const plateau = { id: 29046 };
      vitest.spyOn(plateauFormService, 'getPlateau').mockReturnValue({ id: null });
      vitest.spyOn(plateauService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plateau: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(plateau);
      saveSubject.complete();

      // THEN
      expect(plateauFormService.getPlateau).toHaveBeenCalled();
      expect(plateauService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPlateau>();
      const plateau = { id: 29046 };
      vitest.spyOn(plateauService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plateauService.update).toHaveBeenCalled();
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
  });
});
