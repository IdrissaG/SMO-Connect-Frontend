import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IPlateau } from '../plateau.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../plateau.test-samples';

import { PlateauService } from './plateau.service';

const requireRestSample: IPlateau = {
  ...sampleWithRequiredData,
};

describe('Plateau Service', () => {
  let service: PlateauService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlateau | IPlateau[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PlateauService);
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

    it('should create a Plateau', () => {
      const plateau = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(plateau).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plateau', () => {
      const plateau = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(plateau).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Plateau', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Plateau', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Plateau', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addPlateauToCollectionIfMissing', () => {
      it('should add a Plateau to an empty array', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        expectedResult = service.addPlateauToCollectionIfMissing([], plateau);
        expect(expectedResult).toEqual([plateau]);
      });

      it('should not add a Plateau to an array that contains it', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        const plateauCollection: IPlateau[] = [
          {
            ...plateau,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, plateau);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plateau to an array that doesn't contain it", () => {
        const plateau: IPlateau = sampleWithRequiredData;
        const plateauCollection: IPlateau[] = [sampleWithPartialData];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, plateau);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plateau);
      });

      it('should add only unique Plateau to an array', () => {
        const plateauArray: IPlateau[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const plateauCollection: IPlateau[] = [sampleWithRequiredData];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, ...plateauArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        const plateau2: IPlateau = sampleWithPartialData;
        expectedResult = service.addPlateauToCollectionIfMissing([], plateau, plateau2);
        expect(expectedResult).toEqual([plateau, plateau2]);
      });

      it('should accept null and undefined values', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        expectedResult = service.addPlateauToCollectionIfMissing([], null, plateau, undefined);
        expect(expectedResult).toEqual([plateau]);
      });

      it('should return initial array if no Plateau is added', () => {
        const plateauCollection: IPlateau[] = [sampleWithRequiredData];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, undefined, null);
        expect(expectedResult).toEqual(plateauCollection);
      });
    });

    describe('comparePlateau', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlateau(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 29046 };
        const entity2 = null;

        const compareResult1 = service.comparePlateau(entity1, entity2);
        const compareResult2 = service.comparePlateau(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 29046 };
        const entity2 = { id: 16316 };

        const compareResult1 = service.comparePlateau(entity1, entity2);
        const compareResult2 = service.comparePlateau(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 29046 };
        const entity2 = { id: 29046 };

        const compareResult1 = service.comparePlateau(entity1, entity2);
        const compareResult2 = service.comparePlateau(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
