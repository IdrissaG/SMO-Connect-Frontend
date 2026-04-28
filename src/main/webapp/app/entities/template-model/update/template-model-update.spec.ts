import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { TemplateModelService } from '../service/template-model.service';
import { ITemplateModel } from '../template-model.model';

import { TemplateModelFormService } from './template-model-form.service';
import { TemplateModelUpdate } from './template-model-update';

describe('TemplateModel Management Update Component', () => {
  let comp: TemplateModelUpdate;
  let fixture: ComponentFixture<TemplateModelUpdate>;
  let activatedRoute: ActivatedRoute;
  let templateModelFormService: TemplateModelFormService;
  let templateModelService: TemplateModelService;

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

    fixture = TestBed.createComponent(TemplateModelUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    templateModelFormService = TestBed.inject(TemplateModelFormService);
    templateModelService = TestBed.inject(TemplateModelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const templateModel: ITemplateModel = { id: 29763 };

      activatedRoute.data = of({ templateModel });
      comp.ngOnInit();

      expect(comp.templateModel).toEqual(templateModel);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ITemplateModel>();
      const templateModel = { id: 9978 };
      vitest.spyOn(templateModelFormService, 'getTemplateModel').mockReturnValue(templateModel);
      vitest.spyOn(templateModelService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ templateModel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(templateModel);
      saveSubject.complete();

      // THEN
      expect(templateModelFormService.getTemplateModel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(templateModelService.update).toHaveBeenCalledWith(expect.objectContaining(templateModel));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ITemplateModel>();
      const templateModel = { id: 9978 };
      vitest.spyOn(templateModelFormService, 'getTemplateModel').mockReturnValue({ id: null });
      vitest.spyOn(templateModelService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ templateModel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(templateModel);
      saveSubject.complete();

      // THEN
      expect(templateModelFormService.getTemplateModel).toHaveBeenCalled();
      expect(templateModelService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ITemplateModel>();
      const templateModel = { id: 9978 };
      vitest.spyOn(templateModelService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ templateModel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(templateModelService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
