import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IApplication } from '../application.model';
import { ApplicationService } from '../service/application.service';

import { ApplicationFormService } from './application-form.service';
import { ApplicationUpdate } from './application-update';

describe('Application Management Update Component', () => {
  let comp: ApplicationUpdate;
  let fixture: ComponentFixture<ApplicationUpdate>;
  let activatedRoute: ActivatedRoute;
  let applicationFormService: ApplicationFormService;
  let applicationService: ApplicationService;

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

    fixture = TestBed.createComponent(ApplicationUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationFormService = TestBed.inject(ApplicationFormService);
    applicationService = TestBed.inject(ApplicationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const application: IApplication = { id: 27535 };

      activatedRoute.data = of({ application });
      comp.ngOnInit();

      expect(comp.application).toEqual(application);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IApplication>();
      const application = { id: 8867 };
      vitest.spyOn(applicationFormService, 'getApplication').mockReturnValue(application);
      vitest.spyOn(applicationService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ application });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(application);
      saveSubject.complete();

      // THEN
      expect(applicationFormService.getApplication).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationService.update).toHaveBeenCalledWith(expect.objectContaining(application));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IApplication>();
      const application = { id: 8867 };
      vitest.spyOn(applicationFormService, 'getApplication').mockReturnValue({ id: null });
      vitest.spyOn(applicationService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ application: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(application);
      saveSubject.complete();

      // THEN
      expect(applicationFormService.getApplication).toHaveBeenCalled();
      expect(applicationService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IApplication>();
      const application = { id: 8867 };
      vitest.spyOn(applicationService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ application });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
