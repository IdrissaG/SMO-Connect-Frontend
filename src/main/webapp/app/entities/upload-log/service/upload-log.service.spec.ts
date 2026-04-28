import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IUploadLog } from '../upload-log.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../upload-log.test-samples';

import { UploadLogService } from './upload-log.service';

const requireRestSample: IUploadLog = {
  ...sampleWithRequiredData,
};

describe('UploadLog Service', () => {
  let service: UploadLogService;
  let httpMock: HttpTestingController;
  let expectedResult: IUploadLog | IUploadLog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(UploadLogService);
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

    it('should create a UploadLog', () => {
      const uploadLog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(uploadLog).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UploadLog', () => {
      const uploadLog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(uploadLog).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UploadLog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UploadLog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UploadLog', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addUploadLogToCollectionIfMissing', () => {
      it('should add a UploadLog to an empty array', () => {
        const uploadLog: IUploadLog = sampleWithRequiredData;
        expectedResult = service.addUploadLogToCollectionIfMissing([], uploadLog);
        expect(expectedResult).toEqual([uploadLog]);
      });

      it('should not add a UploadLog to an array that contains it', () => {
        const uploadLog: IUploadLog = sampleWithRequiredData;
        const uploadLogCollection: IUploadLog[] = [
          {
            ...uploadLog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUploadLogToCollectionIfMissing(uploadLogCollection, uploadLog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UploadLog to an array that doesn't contain it", () => {
        const uploadLog: IUploadLog = sampleWithRequiredData;
        const uploadLogCollection: IUploadLog[] = [sampleWithPartialData];
        expectedResult = service.addUploadLogToCollectionIfMissing(uploadLogCollection, uploadLog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(uploadLog);
      });

      it('should add only unique UploadLog to an array', () => {
        const uploadLogArray: IUploadLog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const uploadLogCollection: IUploadLog[] = [sampleWithRequiredData];
        expectedResult = service.addUploadLogToCollectionIfMissing(uploadLogCollection, ...uploadLogArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const uploadLog: IUploadLog = sampleWithRequiredData;
        const uploadLog2: IUploadLog = sampleWithPartialData;
        expectedResult = service.addUploadLogToCollectionIfMissing([], uploadLog, uploadLog2);
        expect(expectedResult).toEqual([uploadLog, uploadLog2]);
      });

      it('should accept null and undefined values', () => {
        const uploadLog: IUploadLog = sampleWithRequiredData;
        expectedResult = service.addUploadLogToCollectionIfMissing([], null, uploadLog, undefined);
        expect(expectedResult).toEqual([uploadLog]);
      });

      it('should return initial array if no UploadLog is added', () => {
        const uploadLogCollection: IUploadLog[] = [sampleWithRequiredData];
        expectedResult = service.addUploadLogToCollectionIfMissing(uploadLogCollection, undefined, null);
        expect(expectedResult).toEqual(uploadLogCollection);
      });
    });

    describe('compareUploadLog', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUploadLog(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 31502 };
        const entity2 = null;

        const compareResult1 = service.compareUploadLog(entity1, entity2);
        const compareResult2 = service.compareUploadLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 31502 };
        const entity2 = { id: 13694 };

        const compareResult1 = service.compareUploadLog(entity1, entity2);
        const compareResult2 = service.compareUploadLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 31502 };
        const entity2 = { id: 31502 };

        const compareResult1 = service.compareUploadLog(entity1, entity2);
        const compareResult2 = service.compareUploadLog(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
