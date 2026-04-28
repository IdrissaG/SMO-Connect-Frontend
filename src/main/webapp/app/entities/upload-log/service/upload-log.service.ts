import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IUploadLog, NewUploadLog } from '../upload-log.model';

export type PartialUpdateUploadLog = Partial<IUploadLog> & Pick<IUploadLog, 'id'>;

@Injectable()
export class UploadLogsService {
  readonly uploadLogsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly uploadLogsResource = httpResource<IUploadLog[]>(() => {
    const params = this.uploadLogsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of uploadLog that have been fetched. It is updated when the uploadLogsResource emits a new value.
   * In case of error while fetching the uploadLogs, the signal is set to an empty array.
   */
  readonly uploadLogs = computed(() => (this.uploadLogsResource.hasValue() ? this.uploadLogsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/upload-logs');
}

@Injectable({ providedIn: 'root' })
export class UploadLogService extends UploadLogsService {
  protected readonly http = inject(HttpClient);

  create(uploadLog: NewUploadLog): Observable<IUploadLog> {
    return this.http.post<IUploadLog>(this.resourceUrl, uploadLog);
  }

  update(uploadLog: IUploadLog): Observable<IUploadLog> {
    return this.http.put<IUploadLog>(`${this.resourceUrl}/${encodeURIComponent(this.getUploadLogIdentifier(uploadLog))}`, uploadLog);
  }

  partialUpdate(uploadLog: PartialUpdateUploadLog): Observable<IUploadLog> {
    return this.http.patch<IUploadLog>(`${this.resourceUrl}/${encodeURIComponent(this.getUploadLogIdentifier(uploadLog))}`, uploadLog);
  }

  find(id: number): Observable<IUploadLog> {
    return this.http.get<IUploadLog>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IUploadLog[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUploadLog[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getUploadLogIdentifier(uploadLog: Pick<IUploadLog, 'id'>): number {
    return uploadLog.id;
  }

  compareUploadLog(o1: Pick<IUploadLog, 'id'> | null, o2: Pick<IUploadLog, 'id'> | null): boolean {
    return o1 && o2 ? this.getUploadLogIdentifier(o1) === this.getUploadLogIdentifier(o2) : o1 === o2;
  }

  addUploadLogToCollectionIfMissing<Type extends Pick<IUploadLog, 'id'>>(
    uploadLogCollection: Type[],
    ...uploadLogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const uploadLogs: Type[] = uploadLogsToCheck.filter(isPresent);
    if (uploadLogs.length > 0) {
      const uploadLogCollectionIdentifiers = uploadLogCollection.map(uploadLogItem => this.getUploadLogIdentifier(uploadLogItem));
      const uploadLogsToAdd = uploadLogs.filter(uploadLogItem => {
        const uploadLogIdentifier = this.getUploadLogIdentifier(uploadLogItem);
        if (uploadLogCollectionIdentifiers.includes(uploadLogIdentifier)) {
          return false;
        }
        uploadLogCollectionIdentifiers.push(uploadLogIdentifier);
        return true;
      });
      return [...uploadLogsToAdd, ...uploadLogCollection];
    }
    return uploadLogCollection;
  }
}
