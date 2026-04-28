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
import { IBlacklist } from '../blacklist.model';
import { BlacklistService } from '../service/blacklist.service';

import { BlacklistFormService } from './blacklist-form.service';
import { BlacklistUpdate } from './blacklist-update';

describe('Blacklist Management Update Component', () => {
  let comp: BlacklistUpdate;
  let fixture: ComponentFixture<BlacklistUpdate>;
  let activatedRoute: ActivatedRoute;
  let blacklistFormService: BlacklistFormService;
  let blacklistService: BlacklistService;
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

    fixture = TestBed.createComponent(BlacklistUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blacklistFormService = TestBed.inject(BlacklistFormService);
    blacklistService = TestBed.inject(BlacklistService);
    prestataireService = TestBed.inject(PrestataireService);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Prestataire query and add missing value', () => {
      const blacklist: IBlacklist = { id: 28526 };
      const prestataire: IPrestataire = { id: 27618 };
      blacklist.prestataire = prestataire;

      const prestataireCollection: IPrestataire[] = [{ id: 27618 }];
      vitest.spyOn(prestataireService, 'query').mockReturnValue(of(new HttpResponse({ body: prestataireCollection })));
      const additionalPrestataires = [prestataire];
      const expectedCollection: IPrestataire[] = [...additionalPrestataires, ...prestataireCollection];
      vitest.spyOn(prestataireService, 'addPrestataireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blacklist });
      comp.ngOnInit();

      expect(prestataireService.query).toHaveBeenCalled();
      expect(prestataireService.addPrestataireToCollectionIfMissing).toHaveBeenCalledWith(
        prestataireCollection,
        ...additionalPrestataires.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.prestatairesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Plateau query and add missing value', () => {
      const blacklist: IBlacklist = { id: 28526 };
      const plateau: IPlateau = { id: 29046 };
      blacklist.plateau = plateau;

      const plateauCollection: IPlateau[] = [{ id: 29046 }];
      vitest.spyOn(plateauService, 'query').mockReturnValue(of(new HttpResponse({ body: plateauCollection })));
      const additionalPlateaus = [plateau];
      const expectedCollection: IPlateau[] = [...additionalPlateaus, ...plateauCollection];
      vitest.spyOn(plateauService, 'addPlateauToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ blacklist });
      comp.ngOnInit();

      expect(plateauService.query).toHaveBeenCalled();
      expect(plateauService.addPlateauToCollectionIfMissing).toHaveBeenCalledWith(
        plateauCollection,
        ...additionalPlateaus.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.plateausSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const blacklist: IBlacklist = { id: 28526 };
      const prestataire: IPrestataire = { id: 27618 };
      blacklist.prestataire = prestataire;
      const plateau: IPlateau = { id: 29046 };
      blacklist.plateau = plateau;

      activatedRoute.data = of({ blacklist });
      comp.ngOnInit();

      expect(comp.prestatairesSharedCollection()).toContainEqual(prestataire);
      expect(comp.plateausSharedCollection()).toContainEqual(plateau);
      expect(comp.blacklist).toEqual(blacklist);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IBlacklist>();
      const blacklist = { id: 22416 };
      vitest.spyOn(blacklistFormService, 'getBlacklist').mockReturnValue(blacklist);
      vitest.spyOn(blacklistService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blacklist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(blacklist);
      saveSubject.complete();

      // THEN
      expect(blacklistFormService.getBlacklist).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(blacklistService.update).toHaveBeenCalledWith(expect.objectContaining(blacklist));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IBlacklist>();
      const blacklist = { id: 22416 };
      vitest.spyOn(blacklistFormService, 'getBlacklist').mockReturnValue({ id: null });
      vitest.spyOn(blacklistService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blacklist: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(blacklist);
      saveSubject.complete();

      // THEN
      expect(blacklistFormService.getBlacklist).toHaveBeenCalled();
      expect(blacklistService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IBlacklist>();
      const blacklist = { id: 22416 };
      vitest.spyOn(blacklistService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ blacklist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blacklistService.update).toHaveBeenCalled();
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
