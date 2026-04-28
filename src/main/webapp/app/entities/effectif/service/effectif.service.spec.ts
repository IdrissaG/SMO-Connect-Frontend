import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEffectif } from '../effectif.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../effectif.test-samples';

import { EffectifService, RestEffectif } from './effectif.service';

const requireRestSample: RestEffectif = {
  ...sampleWithRequiredData,
  dateRemontee: sampleWithRequiredData.dateRemontee?.format(DATE_FORMAT),
  dateDemarrageFormation: sampleWithRequiredData.dateDemarrageFormation?.format(DATE_FORMAT),
  dateEntreeProd: sampleWithRequiredData.dateEntreeProd?.format(DATE_FORMAT),
  dateSortie: sampleWithRequiredData.dateSortie?.format(DATE_FORMAT),
  dateReintegration: sampleWithRequiredData.dateReintegration?.format(DATE_FORMAT),
  dateEnvoyeTidjiCreation: sampleWithRequiredData.dateEnvoyeTidjiCreation?.toJSON(),
  dateEnvoyeTidjiReactivation: sampleWithRequiredData.dateEnvoyeTidjiReactivation?.toJSON(),
  dateEnvoyeTidjiModification: sampleWithRequiredData.dateEnvoyeTidjiModification?.toJSON(),
};

describe('Effectif Service', () => {
  let service: EffectifService;
  let httpMock: HttpTestingController;
  let expectedResult: IEffectif | IEffectif[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EffectifService);
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

    it('should create a Effectif', () => {
      const effectif = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(effectif).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Effectif', () => {
      const effectif = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(effectif).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Effectif', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Effectif', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Effectif', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addEffectifToCollectionIfMissing', () => {
      it('should add a Effectif to an empty array', () => {
        const effectif: IEffectif = sampleWithRequiredData;
        expectedResult = service.addEffectifToCollectionIfMissing([], effectif);
        expect(expectedResult).toEqual([effectif]);
      });

      it('should not add a Effectif to an array that contains it', () => {
        const effectif: IEffectif = sampleWithRequiredData;
        const effectifCollection: IEffectif[] = [
          {
            ...effectif,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEffectifToCollectionIfMissing(effectifCollection, effectif);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Effectif to an array that doesn't contain it", () => {
        const effectif: IEffectif = sampleWithRequiredData;
        const effectifCollection: IEffectif[] = [sampleWithPartialData];
        expectedResult = service.addEffectifToCollectionIfMissing(effectifCollection, effectif);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(effectif);
      });

      it('should add only unique Effectif to an array', () => {
        const effectifArray: IEffectif[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const effectifCollection: IEffectif[] = [sampleWithRequiredData];
        expectedResult = service.addEffectifToCollectionIfMissing(effectifCollection, ...effectifArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const effectif: IEffectif = sampleWithRequiredData;
        const effectif2: IEffectif = sampleWithPartialData;
        expectedResult = service.addEffectifToCollectionIfMissing([], effectif, effectif2);
        expect(expectedResult).toEqual([effectif, effectif2]);
      });

      it('should accept null and undefined values', () => {
        const effectif: IEffectif = sampleWithRequiredData;
        expectedResult = service.addEffectifToCollectionIfMissing([], null, effectif, undefined);
        expect(expectedResult).toEqual([effectif]);
      });

      it('should return initial array if no Effectif is added', () => {
        const effectifCollection: IEffectif[] = [sampleWithRequiredData];
        expectedResult = service.addEffectifToCollectionIfMissing(effectifCollection, undefined, null);
        expect(expectedResult).toEqual(effectifCollection);
      });
    });

    describe('compareEffectif', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEffectif(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 14359 };
        const entity2 = null;

        const compareResult1 = service.compareEffectif(entity1, entity2);
        const compareResult2 = service.compareEffectif(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 14359 };
        const entity2 = { id: 9335 };

        const compareResult1 = service.compareEffectif(entity1, entity2);
        const compareResult2 = service.compareEffectif(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 14359 };
        const entity2 = { id: 14359 };

        const compareResult1 = service.compareEffectif(entity1, entity2);
        const compareResult2 = service.compareEffectif(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
