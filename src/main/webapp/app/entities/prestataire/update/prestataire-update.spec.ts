import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IPrestataire } from '../prestataire.model';
import { PrestataireService } from '../service/prestataire.service';

import { PrestataireFormService } from './prestataire-form.service';
import { PrestataireUpdate } from './prestataire-update';

describe('Prestataire Management Update Component', () => {
  let comp: PrestataireUpdate;
  let fixture: ComponentFixture<PrestataireUpdate>;
  let activatedRoute: ActivatedRoute;
  let prestataireFormService: PrestataireFormService;
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

    fixture = TestBed.createComponent(PrestataireUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    prestataireFormService = TestBed.inject(PrestataireFormService);
    prestataireService = TestBed.inject(PrestataireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const prestataire: IPrestataire = { id: 28861 };

      activatedRoute.data = of({ prestataire });
      comp.ngOnInit();

      expect(comp.prestataire).toEqual(prestataire);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPrestataire>();
      const prestataire = { id: 27618 };
      vitest.spyOn(prestataireFormService, 'getPrestataire').mockReturnValue(prestataire);
      vitest.spyOn(prestataireService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prestataire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(prestataire);
      saveSubject.complete();

      // THEN
      expect(prestataireFormService.getPrestataire).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(prestataireService.update).toHaveBeenCalledWith(expect.objectContaining(prestataire));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPrestataire>();
      const prestataire = { id: 27618 };
      vitest.spyOn(prestataireFormService, 'getPrestataire').mockReturnValue({ id: null });
      vitest.spyOn(prestataireService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prestataire: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(prestataire);
      saveSubject.complete();

      // THEN
      expect(prestataireFormService.getPrestataire).toHaveBeenCalled();
      expect(prestataireService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPrestataire>();
      const prestataire = { id: 27618 };
      vitest.spyOn(prestataireService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ prestataire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(prestataireService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
