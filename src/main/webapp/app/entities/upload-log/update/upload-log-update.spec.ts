import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { UploadLogService } from '../service/upload-log.service';
import { IUploadLog } from '../upload-log.model';

import { UploadLogFormService } from './upload-log-form.service';
import { UploadLogUpdate } from './upload-log-update';

describe('UploadLog Management Update Component', () => {
  let comp: UploadLogUpdate;
  let fixture: ComponentFixture<UploadLogUpdate>;
  let activatedRoute: ActivatedRoute;
  let uploadLogFormService: UploadLogFormService;
  let uploadLogService: UploadLogService;

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

    fixture = TestBed.createComponent(UploadLogUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    uploadLogFormService = TestBed.inject(UploadLogFormService);
    uploadLogService = TestBed.inject(UploadLogService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const uploadLog: IUploadLog = { id: 13694 };

      activatedRoute.data = of({ uploadLog });
      comp.ngOnInit();

      expect(comp.uploadLog).toEqual(uploadLog);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IUploadLog>();
      const uploadLog = { id: 31502 };
      vitest.spyOn(uploadLogFormService, 'getUploadLog').mockReturnValue(uploadLog);
      vitest.spyOn(uploadLogService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uploadLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(uploadLog);
      saveSubject.complete();

      // THEN
      expect(uploadLogFormService.getUploadLog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(uploadLogService.update).toHaveBeenCalledWith(expect.objectContaining(uploadLog));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IUploadLog>();
      const uploadLog = { id: 31502 };
      vitest.spyOn(uploadLogFormService, 'getUploadLog').mockReturnValue({ id: null });
      vitest.spyOn(uploadLogService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uploadLog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(uploadLog);
      saveSubject.complete();

      // THEN
      expect(uploadLogFormService.getUploadLog).toHaveBeenCalled();
      expect(uploadLogService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IUploadLog>();
      const uploadLog = { id: 31502 };
      vitest.spyOn(uploadLogService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ uploadLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(uploadLogService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
