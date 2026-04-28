import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IResetPassword } from '../reset-password.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../reset-password.test-samples';

import { ResetPasswordService, RestResetPassword } from './reset-password.service';

const requireRestSample: RestResetPassword = {
  ...sampleWithRequiredData,
  dateEnvoi: sampleWithRequiredData.dateEnvoi?.toJSON(),
  dateCloture: sampleWithRequiredData.dateCloture?.toJSON(),
};

describe('ResetPassword Service', () => {
  let service: ResetPasswordService;
  let httpMock: HttpTestingController;
  let expectedResult: IResetPassword | IResetPassword[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ResetPasswordService);
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

    it('should create a ResetPassword', () => {
      const resetPassword = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resetPassword).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ResetPassword', () => {
      const resetPassword = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resetPassword).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ResetPassword', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ResetPassword', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ResetPassword', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addResetPasswordToCollectionIfMissing', () => {
      it('should add a ResetPassword to an empty array', () => {
        const resetPassword: IResetPassword = sampleWithRequiredData;
        expectedResult = service.addResetPasswordToCollectionIfMissing([], resetPassword);
        expect(expectedResult).toEqual([resetPassword]);
      });

      it('should not add a ResetPassword to an array that contains it', () => {
        const resetPassword: IResetPassword = sampleWithRequiredData;
        const resetPasswordCollection: IResetPassword[] = [
          {
            ...resetPassword,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResetPasswordToCollectionIfMissing(resetPasswordCollection, resetPassword);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ResetPassword to an array that doesn't contain it", () => {
        const resetPassword: IResetPassword = sampleWithRequiredData;
        const resetPasswordCollection: IResetPassword[] = [sampleWithPartialData];
        expectedResult = service.addResetPasswordToCollectionIfMissing(resetPasswordCollection, resetPassword);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resetPassword);
      });

      it('should add only unique ResetPassword to an array', () => {
        const resetPasswordArray: IResetPassword[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const resetPasswordCollection: IResetPassword[] = [sampleWithRequiredData];
        expectedResult = service.addResetPasswordToCollectionIfMissing(resetPasswordCollection, ...resetPasswordArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resetPassword: IResetPassword = sampleWithRequiredData;
        const resetPassword2: IResetPassword = sampleWithPartialData;
        expectedResult = service.addResetPasswordToCollectionIfMissing([], resetPassword, resetPassword2);
        expect(expectedResult).toEqual([resetPassword, resetPassword2]);
      });

      it('should accept null and undefined values', () => {
        const resetPassword: IResetPassword = sampleWithRequiredData;
        expectedResult = service.addResetPasswordToCollectionIfMissing([], null, resetPassword, undefined);
        expect(expectedResult).toEqual([resetPassword]);
      });

      it('should return initial array if no ResetPassword is added', () => {
        const resetPasswordCollection: IResetPassword[] = [sampleWithRequiredData];
        expectedResult = service.addResetPasswordToCollectionIfMissing(resetPasswordCollection, undefined, null);
        expect(expectedResult).toEqual(resetPasswordCollection);
      });
    });

    describe('compareResetPassword', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResetPassword(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 13864 };
        const entity2 = null;

        const compareResult1 = service.compareResetPassword(entity1, entity2);
        const compareResult2 = service.compareResetPassword(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 13864 };
        const entity2 = { id: 22117 };

        const compareResult1 = service.compareResetPassword(entity1, entity2);
        const compareResult2 = service.compareResetPassword(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 13864 };
        const entity2 = { id: 13864 };

        const compareResult1 = service.compareResetPassword(entity1, entity2);
        const compareResult2 = service.compareResetPassword(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
