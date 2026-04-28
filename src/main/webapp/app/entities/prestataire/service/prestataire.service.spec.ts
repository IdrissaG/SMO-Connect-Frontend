import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPrestataire } from '../prestataire.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../prestataire.test-samples';

import { PrestataireService } from './prestataire.service';

const requireRestSample: IPrestataire = {
  ...sampleWithRequiredData,
};

describe('Prestataire Service', () => {
  let service: PrestataireService;
  let httpMock: HttpTestingController;
  let expectedResult: IPrestataire | IPrestataire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PrestataireService);
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

    it('should create a Prestataire', () => {
      const prestataire = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(prestataire).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Prestataire', () => {
      const prestataire = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(prestataire).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Prestataire', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Prestataire', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Prestataire', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addPrestataireToCollectionIfMissing', () => {
      it('should add a Prestataire to an empty array', () => {
        const prestataire: IPrestataire = sampleWithRequiredData;
        expectedResult = service.addPrestataireToCollectionIfMissing([], prestataire);
        expect(expectedResult).toEqual([prestataire]);
      });

      it('should not add a Prestataire to an array that contains it', () => {
        const prestataire: IPrestataire = sampleWithRequiredData;
        const prestataireCollection: IPrestataire[] = [
          {
            ...prestataire,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPrestataireToCollectionIfMissing(prestataireCollection, prestataire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Prestataire to an array that doesn't contain it", () => {
        const prestataire: IPrestataire = sampleWithRequiredData;
        const prestataireCollection: IPrestataire[] = [sampleWithPartialData];
        expectedResult = service.addPrestataireToCollectionIfMissing(prestataireCollection, prestataire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(prestataire);
      });

      it('should add only unique Prestataire to an array', () => {
        const prestataireArray: IPrestataire[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const prestataireCollection: IPrestataire[] = [sampleWithRequiredData];
        expectedResult = service.addPrestataireToCollectionIfMissing(prestataireCollection, ...prestataireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const prestataire: IPrestataire = sampleWithRequiredData;
        const prestataire2: IPrestataire = sampleWithPartialData;
        expectedResult = service.addPrestataireToCollectionIfMissing([], prestataire, prestataire2);
        expect(expectedResult).toEqual([prestataire, prestataire2]);
      });

      it('should accept null and undefined values', () => {
        const prestataire: IPrestataire = sampleWithRequiredData;
        expectedResult = service.addPrestataireToCollectionIfMissing([], null, prestataire, undefined);
        expect(expectedResult).toEqual([prestataire]);
      });

      it('should return initial array if no Prestataire is added', () => {
        const prestataireCollection: IPrestataire[] = [sampleWithRequiredData];
        expectedResult = service.addPrestataireToCollectionIfMissing(prestataireCollection, undefined, null);
        expect(expectedResult).toEqual(prestataireCollection);
      });
    });

    describe('comparePrestataire', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePrestataire(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 27618 };
        const entity2 = null;

        const compareResult1 = service.comparePrestataire(entity1, entity2);
        const compareResult2 = service.comparePrestataire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 27618 };
        const entity2 = { id: 28861 };

        const compareResult1 = service.comparePrestataire(entity1, entity2);
        const compareResult2 = service.comparePrestataire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 27618 };
        const entity2 = { id: 27618 };

        const compareResult1 = service.comparePrestataire(entity1, entity2);
        const compareResult2 = service.comparePrestataire(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
