import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBlacklist } from '../blacklist.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../blacklist.test-samples';

import { BlacklistService, RestBlacklist } from './blacklist.service';

const requireRestSample: RestBlacklist = {
  ...sampleWithRequiredData,
  dateFaits: sampleWithRequiredData.dateFaits?.format(DATE_FORMAT),
  dateDetection: sampleWithRequiredData.dateDetection?.format(DATE_FORMAT),
  dateRemontee: sampleWithRequiredData.dateRemontee?.format(DATE_FORMAT),
};

describe('Blacklist Service', () => {
  let service: BlacklistService;
  let httpMock: HttpTestingController;
  let expectedResult: IBlacklist | IBlacklist[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BlacklistService);
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

    it('should create a Blacklist', () => {
      const blacklist = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(blacklist).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Blacklist', () => {
      const blacklist = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(blacklist).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Blacklist', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Blacklist', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Blacklist', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addBlacklistToCollectionIfMissing', () => {
      it('should add a Blacklist to an empty array', () => {
        const blacklist: IBlacklist = sampleWithRequiredData;
        expectedResult = service.addBlacklistToCollectionIfMissing([], blacklist);
        expect(expectedResult).toEqual([blacklist]);
      });

      it('should not add a Blacklist to an array that contains it', () => {
        const blacklist: IBlacklist = sampleWithRequiredData;
        const blacklistCollection: IBlacklist[] = [
          {
            ...blacklist,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBlacklistToCollectionIfMissing(blacklistCollection, blacklist);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Blacklist to an array that doesn't contain it", () => {
        const blacklist: IBlacklist = sampleWithRequiredData;
        const blacklistCollection: IBlacklist[] = [sampleWithPartialData];
        expectedResult = service.addBlacklistToCollectionIfMissing(blacklistCollection, blacklist);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blacklist);
      });

      it('should add only unique Blacklist to an array', () => {
        const blacklistArray: IBlacklist[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const blacklistCollection: IBlacklist[] = [sampleWithRequiredData];
        expectedResult = service.addBlacklistToCollectionIfMissing(blacklistCollection, ...blacklistArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blacklist: IBlacklist = sampleWithRequiredData;
        const blacklist2: IBlacklist = sampleWithPartialData;
        expectedResult = service.addBlacklistToCollectionIfMissing([], blacklist, blacklist2);
        expect(expectedResult).toEqual([blacklist, blacklist2]);
      });

      it('should accept null and undefined values', () => {
        const blacklist: IBlacklist = sampleWithRequiredData;
        expectedResult = service.addBlacklistToCollectionIfMissing([], null, blacklist, undefined);
        expect(expectedResult).toEqual([blacklist]);
      });

      it('should return initial array if no Blacklist is added', () => {
        const blacklistCollection: IBlacklist[] = [sampleWithRequiredData];
        expectedResult = service.addBlacklistToCollectionIfMissing(blacklistCollection, undefined, null);
        expect(expectedResult).toEqual(blacklistCollection);
      });
    });

    describe('compareBlacklist', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBlacklist(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 22416 };
        const entity2 = null;

        const compareResult1 = service.compareBlacklist(entity1, entity2);
        const compareResult2 = service.compareBlacklist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 22416 };
        const entity2 = { id: 28526 };

        const compareResult1 = service.compareBlacklist(entity1, entity2);
        const compareResult2 = service.compareBlacklist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 22416 };
        const entity2 = { id: 22416 };

        const compareResult1 = service.compareBlacklist(entity1, entity2);
        const compareResult2 = service.compareBlacklist(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
