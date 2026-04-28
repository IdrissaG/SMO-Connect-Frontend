import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IBlacklist, NewBlacklist } from '../blacklist.model';

export type PartialUpdateBlacklist = Partial<IBlacklist> & Pick<IBlacklist, 'id'>;

type RestOf<T extends IBlacklist | NewBlacklist> = Omit<T, 'dateFaits' | 'dateDetection' | 'dateRemontee'> & {
  dateFaits?: string | null;
  dateDetection?: string | null;
  dateRemontee?: string | null;
};

export type RestBlacklist = RestOf<IBlacklist>;

export type NewRestBlacklist = RestOf<NewBlacklist>;

export type PartialUpdateRestBlacklist = RestOf<PartialUpdateBlacklist>;

@Injectable()
export class BlacklistsService {
  readonly blacklistsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly blacklistsResource = httpResource<RestBlacklist[]>(() => {
    const params = this.blacklistsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of blacklist that have been fetched. It is updated when the blacklistsResource emits a new value.
   * In case of error while fetching the blacklists, the signal is set to an empty array.
   */
  readonly blacklists = computed(() =>
    (this.blacklistsResource.hasValue() ? this.blacklistsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/blacklists');

  protected convertValueFromServer(restBlacklist: RestBlacklist): IBlacklist {
    return {
      ...restBlacklist,
      dateFaits: restBlacklist.dateFaits ? dayjs(restBlacklist.dateFaits) : undefined,
      dateDetection: restBlacklist.dateDetection ? dayjs(restBlacklist.dateDetection) : undefined,
      dateRemontee: restBlacklist.dateRemontee ? dayjs(restBlacklist.dateRemontee) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class BlacklistService extends BlacklistsService {
  protected readonly http = inject(HttpClient);

  create(blacklist: NewBlacklist): Observable<IBlacklist> {
    const copy = this.convertValueFromClient(blacklist);
    return this.http.post<RestBlacklist>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(blacklist: IBlacklist): Observable<IBlacklist> {
    const copy = this.convertValueFromClient(blacklist);
    return this.http
      .put<RestBlacklist>(`${this.resourceUrl}/${encodeURIComponent(this.getBlacklistIdentifier(blacklist))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(blacklist: PartialUpdateBlacklist): Observable<IBlacklist> {
    const copy = this.convertValueFromClient(blacklist);
    return this.http
      .patch<RestBlacklist>(`${this.resourceUrl}/${encodeURIComponent(this.getBlacklistIdentifier(blacklist))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IBlacklist> {
    return this.http
      .get<RestBlacklist>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IBlacklist[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBlacklist[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getBlacklistIdentifier(blacklist: Pick<IBlacklist, 'id'>): number {
    return blacklist.id;
  }

  compareBlacklist(o1: Pick<IBlacklist, 'id'> | null, o2: Pick<IBlacklist, 'id'> | null): boolean {
    return o1 && o2 ? this.getBlacklistIdentifier(o1) === this.getBlacklistIdentifier(o2) : o1 === o2;
  }

  addBlacklistToCollectionIfMissing<Type extends Pick<IBlacklist, 'id'>>(
    blacklistCollection: Type[],
    ...blacklistsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const blacklists: Type[] = blacklistsToCheck.filter(isPresent);
    if (blacklists.length > 0) {
      const blacklistCollectionIdentifiers = blacklistCollection.map(blacklistItem => this.getBlacklistIdentifier(blacklistItem));
      const blacklistsToAdd = blacklists.filter(blacklistItem => {
        const blacklistIdentifier = this.getBlacklistIdentifier(blacklistItem);
        if (blacklistCollectionIdentifiers.includes(blacklistIdentifier)) {
          return false;
        }
        blacklistCollectionIdentifiers.push(blacklistIdentifier);
        return true;
      });
      return [...blacklistsToAdd, ...blacklistCollection];
    }
    return blacklistCollection;
  }

  protected convertValueFromClient<T extends IBlacklist | NewBlacklist | PartialUpdateBlacklist>(blacklist: T): RestOf<T> {
    return {
      ...blacklist,
      dateFaits: blacklist.dateFaits?.format(DATE_FORMAT) ?? null,
      dateDetection: blacklist.dateDetection?.format(DATE_FORMAT) ?? null,
      dateRemontee: blacklist.dateRemontee?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestBlacklist): IBlacklist {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestBlacklist[]): IBlacklist[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
