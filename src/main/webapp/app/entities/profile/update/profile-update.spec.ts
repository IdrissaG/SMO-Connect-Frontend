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
import { IProfile } from '../profile.model';
import { ProfileService } from '../service/profile.service';

import { ProfileFormService } from './profile-form.service';
import { ProfileUpdate } from './profile-update';

describe('Profile Management Update Component', () => {
  let comp: ProfileUpdate;
  let fixture: ComponentFixture<ProfileUpdate>;
  let activatedRoute: ActivatedRoute;
  let profileFormService: ProfileFormService;
  let profileService: ProfileService;
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

    fixture = TestBed.createComponent(ProfileUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    profileFormService = TestBed.inject(ProfileFormService);
    profileService = TestBed.inject(ProfileService);
    prestataireService = TestBed.inject(PrestataireService);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Prestataire query and add missing value', () => {
      const profile: IProfile = { id: 13324 };
      const prestataire: IPrestataire = { id: 27618 };
      profile.prestataire = prestataire;

      const prestataireCollection: IPrestataire[] = [{ id: 27618 }];
      vitest.spyOn(prestataireService, 'query').mockReturnValue(of(new HttpResponse({ body: prestataireCollection })));
      const additionalPrestataires = [prestataire];
      const expectedCollection: IPrestataire[] = [...additionalPrestataires, ...prestataireCollection];
      vitest.spyOn(prestataireService, 'addPrestataireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(prestataireService.query).toHaveBeenCalled();
      expect(prestataireService.addPrestataireToCollectionIfMissing).toHaveBeenCalledWith(
        prestataireCollection,
        ...additionalPrestataires.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.prestatairesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Plateau query and add missing value', () => {
      const profile: IProfile = { id: 13324 };
      const plateau: IPlateau = { id: 29046 };
      profile.plateau = plateau;

      const plateauCollection: IPlateau[] = [{ id: 29046 }];
      vitest.spyOn(plateauService, 'query').mockReturnValue(of(new HttpResponse({ body: plateauCollection })));
      const additionalPlateaus = [plateau];
      const expectedCollection: IPlateau[] = [...additionalPlateaus, ...plateauCollection];
      vitest.spyOn(plateauService, 'addPlateauToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(plateauService.query).toHaveBeenCalled();
      expect(plateauService.addPlateauToCollectionIfMissing).toHaveBeenCalledWith(
        plateauCollection,
        ...additionalPlateaus.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.plateausSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const profile: IProfile = { id: 13324 };
      const prestataire: IPrestataire = { id: 27618 };
      profile.prestataire = prestataire;
      const plateau: IPlateau = { id: 29046 };
      profile.plateau = plateau;

      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      expect(comp.prestatairesSharedCollection()).toContainEqual(prestataire);
      expect(comp.plateausSharedCollection()).toContainEqual(plateau);
      expect(comp.profile).toEqual(profile);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IProfile>();
      const profile = { id: 32255 };
      vitest.spyOn(profileFormService, 'getProfile').mockReturnValue(profile);
      vitest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(profile);
      saveSubject.complete();

      // THEN
      expect(profileFormService.getProfile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(profileService.update).toHaveBeenCalledWith(expect.objectContaining(profile));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IProfile>();
      const profile = { id: 32255 };
      vitest.spyOn(profileFormService, 'getProfile').mockReturnValue({ id: null });
      vitest.spyOn(profileService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(profile);
      saveSubject.complete();

      // THEN
      expect(profileFormService.getProfile).toHaveBeenCalled();
      expect(profileService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IProfile>();
      const profile = { id: 32255 };
      vitest.spyOn(profileService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ profile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(profileService.update).toHaveBeenCalled();
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
