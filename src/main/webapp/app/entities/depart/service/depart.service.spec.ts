import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDepart } from '../depart.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../depart.test-samples';

import { DepartService, RestDepart } from './depart.service';

const requireRestSample: RestDepart = {
  ...sampleWithRequiredData,
  dateDepart: sampleWithRequiredData.dateDepart?.format(DATE_FORMAT),
  desistementFormation: sampleWithRequiredData.desistementFormation?.toJSON(),
  dateRemontee: sampleWithRequiredData.dateRemontee?.format(DATE_FORMAT),
};

describe('Depart Service', () => {
  let service: DepartService;
  let httpMock: HttpTestingController;
  let expectedResult: IDepart | IDepart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DepartService);
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

    it('should create a Depart', () => {
      const depart = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(depart).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Depart', () => {
      const depart = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(depart).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Depart', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Depart', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Depart', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addDepartToCollectionIfMissing', () => {
      it('should add a Depart to an empty array', () => {
        const depart: IDepart = sampleWithRequiredData;
        expectedResult = service.addDepartToCollectionIfMissing([], depart);
        expect(expectedResult).toEqual([depart]);
      });

      it('should not add a Depart to an array that contains it', () => {
        const depart: IDepart = sampleWithRequiredData;
        const departCollection: IDepart[] = [
          {
            ...depart,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDepartToCollectionIfMissing(departCollection, depart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Depart to an array that doesn't contain it", () => {
        const depart: IDepart = sampleWithRequiredData;
        const departCollection: IDepart[] = [sampleWithPartialData];
        expectedResult = service.addDepartToCollectionIfMissing(departCollection, depart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(depart);
      });

      it('should add only unique Depart to an array', () => {
        const departArray: IDepart[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const departCollection: IDepart[] = [sampleWithRequiredData];
        expectedResult = service.addDepartToCollectionIfMissing(departCollection, ...departArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const depart: IDepart = sampleWithRequiredData;
        const depart2: IDepart = sampleWithPartialData;
        expectedResult = service.addDepartToCollectionIfMissing([], depart, depart2);
        expect(expectedResult).toEqual([depart, depart2]);
      });

      it('should accept null and undefined values', () => {
        const depart: IDepart = sampleWithRequiredData;
        expectedResult = service.addDepartToCollectionIfMissing([], null, depart, undefined);
        expect(expectedResult).toEqual([depart]);
      });

      it('should return initial array if no Depart is added', () => {
        const departCollection: IDepart[] = [sampleWithRequiredData];
        expectedResult = service.addDepartToCollectionIfMissing(departCollection, undefined, null);
        expect(expectedResult).toEqual(departCollection);
      });
    });

    describe('compareDepart', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDepart(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1161 };
        const entity2 = null;

        const compareResult1 = service.compareDepart(entity1, entity2);
        const compareResult2 = service.compareDepart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1161 };
        const entity2 = { id: 16150 };

        const compareResult1 = service.compareDepart(entity1, entity2);
        const compareResult2 = service.compareDepart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1161 };
        const entity2 = { id: 1161 };

        const compareResult1 = service.compareDepart(entity1, entity2);
        const compareResult2 = service.compareDepart(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
