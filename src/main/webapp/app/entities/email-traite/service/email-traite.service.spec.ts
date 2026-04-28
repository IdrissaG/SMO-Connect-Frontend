import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IEmailTraite } from '../email-traite.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../email-traite.test-samples';

import { EmailTraiteService, RestEmailTraite } from './email-traite.service';

const requireRestSample: RestEmailTraite = {
  ...sampleWithRequiredData,
  dateReception: sampleWithRequiredData.dateReception?.toJSON(),
};

describe('EmailTraite Service', () => {
  let service: EmailTraiteService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmailTraite | IEmailTraite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EmailTraiteService);
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

    it('should create a EmailTraite', () => {
      const emailTraite = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(emailTraite).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmailTraite', () => {
      const emailTraite = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(emailTraite).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmailTraite', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmailTraite', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmailTraite', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addEmailTraiteToCollectionIfMissing', () => {
      it('should add a EmailTraite to an empty array', () => {
        const emailTraite: IEmailTraite = sampleWithRequiredData;
        expectedResult = service.addEmailTraiteToCollectionIfMissing([], emailTraite);
        expect(expectedResult).toEqual([emailTraite]);
      });

      it('should not add a EmailTraite to an array that contains it', () => {
        const emailTraite: IEmailTraite = sampleWithRequiredData;
        const emailTraiteCollection: IEmailTraite[] = [
          {
            ...emailTraite,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmailTraiteToCollectionIfMissing(emailTraiteCollection, emailTraite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmailTraite to an array that doesn't contain it", () => {
        const emailTraite: IEmailTraite = sampleWithRequiredData;
        const emailTraiteCollection: IEmailTraite[] = [sampleWithPartialData];
        expectedResult = service.addEmailTraiteToCollectionIfMissing(emailTraiteCollection, emailTraite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(emailTraite);
      });

      it('should add only unique EmailTraite to an array', () => {
        const emailTraiteArray: IEmailTraite[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const emailTraiteCollection: IEmailTraite[] = [sampleWithRequiredData];
        expectedResult = service.addEmailTraiteToCollectionIfMissing(emailTraiteCollection, ...emailTraiteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const emailTraite: IEmailTraite = sampleWithRequiredData;
        const emailTraite2: IEmailTraite = sampleWithPartialData;
        expectedResult = service.addEmailTraiteToCollectionIfMissing([], emailTraite, emailTraite2);
        expect(expectedResult).toEqual([emailTraite, emailTraite2]);
      });

      it('should accept null and undefined values', () => {
        const emailTraite: IEmailTraite = sampleWithRequiredData;
        expectedResult = service.addEmailTraiteToCollectionIfMissing([], null, emailTraite, undefined);
        expect(expectedResult).toEqual([emailTraite]);
      });

      it('should return initial array if no EmailTraite is added', () => {
        const emailTraiteCollection: IEmailTraite[] = [sampleWithRequiredData];
        expectedResult = service.addEmailTraiteToCollectionIfMissing(emailTraiteCollection, undefined, null);
        expect(expectedResult).toEqual(emailTraiteCollection);
      });
    });

    describe('compareEmailTraite', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmailTraite(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 18838 };
        const entity2 = null;

        const compareResult1 = service.compareEmailTraite(entity1, entity2);
        const compareResult2 = service.compareEmailTraite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 18838 };
        const entity2 = { id: 27530 };

        const compareResult1 = service.compareEmailTraite(entity1, entity2);
        const compareResult2 = service.compareEmailTraite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 18838 };
        const entity2 = { id: 18838 };

        const compareResult1 = service.compareEmailTraite(entity1, entity2);
        const compareResult2 = service.compareEmailTraite(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
