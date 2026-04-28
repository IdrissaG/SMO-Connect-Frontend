import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ITemplateModel } from '../template-model.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../template-model.test-samples';

import { TemplateModelService } from './template-model.service';

const requireRestSample: ITemplateModel = {
  ...sampleWithRequiredData,
};

describe('TemplateModel Service', () => {
  let service: TemplateModelService;
  let httpMock: HttpTestingController;
  let expectedResult: ITemplateModel | ITemplateModel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TemplateModelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TemplateModel', () => {
      const templateModel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(templateModel).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TemplateModel', () => {
      const templateModel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(templateModel).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TemplateModel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TemplateModel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TemplateModel', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addTemplateModelToCollectionIfMissing', () => {
      it('should add a TemplateModel to an empty array', () => {
        const templateModel: ITemplateModel = sampleWithRequiredData;
        expectedResult = service.addTemplateModelToCollectionIfMissing([], templateModel);
        expect(expectedResult).toEqual([templateModel]);
      });

      it('should not add a TemplateModel to an array that contains it', () => {
        const templateModel: ITemplateModel = sampleWithRequiredData;
        const templateModelCollection: ITemplateModel[] = [
          {
            ...templateModel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTemplateModelToCollectionIfMissing(templateModelCollection, templateModel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TemplateModel to an array that doesn't contain it", () => {
        const templateModel: ITemplateModel = sampleWithRequiredData;
        const templateModelCollection: ITemplateModel[] = [sampleWithPartialData];
        expectedResult = service.addTemplateModelToCollectionIfMissing(templateModelCollection, templateModel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(templateModel);
      });

      it('should add only unique TemplateModel to an array', () => {
        const templateModelArray: ITemplateModel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const templateModelCollection: ITemplateModel[] = [sampleWithRequiredData];
        expectedResult = service.addTemplateModelToCollectionIfMissing(templateModelCollection, ...templateModelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const templateModel: ITemplateModel = sampleWithRequiredData;
        const templateModel2: ITemplateModel = sampleWithPartialData;
        expectedResult = service.addTemplateModelToCollectionIfMissing([], templateModel, templateModel2);
        expect(expectedResult).toEqual([templateModel, templateModel2]);
      });

      it('should accept null and undefined values', () => {
        const templateModel: ITemplateModel = sampleWithRequiredData;
        expectedResult = service.addTemplateModelToCollectionIfMissing([], null, templateModel, undefined);
        expect(expectedResult).toEqual([templateModel]);
      });

      it('should return initial array if no TemplateModel is added', () => {
        const templateModelCollection: ITemplateModel[] = [sampleWithRequiredData];
        expectedResult = service.addTemplateModelToCollectionIfMissing(templateModelCollection, undefined, null);
        expect(expectedResult).toEqual(templateModelCollection);
      });
    });

    describe('compareTemplateModel', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTemplateModel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 9978 };
        const entity2 = null;

        const compareResult1 = service.compareTemplateModel(entity1, entity2);
        const compareResult2 = service.compareTemplateModel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 9978 };
        const entity2 = { id: 29763 };

        const compareResult1 = service.compareTemplateModel(entity1, entity2);
        const compareResult2 = service.compareTemplateModel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 9978 };
        const entity2 = { id: 9978 };

        const compareResult1 = service.compareTemplateModel(entity1, entity2);
        const compareResult2 = service.compareTemplateModel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
