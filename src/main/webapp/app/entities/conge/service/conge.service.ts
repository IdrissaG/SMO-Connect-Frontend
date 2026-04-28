import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IConge, NewConge } from '../conge.model';

export type PartialUpdateConge = Partial<IConge> & Pick<IConge, 'id'>;

type RestOf<T extends IConge | NewConge> = Omit<T, 'dateDebut' | 'dateRetour'> & {
  dateDebut?: string | null;
  dateRetour?: string | null;
};

export type RestConge = RestOf<IConge>;

export type NewRestConge = RestOf<NewConge>;

export type PartialUpdateRestConge = RestOf<PartialUpdateConge>;

@Injectable()
export class CongesService {
  readonly congesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly congesResource = httpResource<RestConge[]>(() => {
    const params = this.congesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of conge that have been fetched. It is updated when the congesResource emits a new value.
   * In case of error while fetching the conges, the signal is set to an empty array.
   */
  readonly conges = computed(() =>
    (this.congesResource.hasValue() ? this.congesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/conges');

  protected convertValueFromServer(restConge: RestConge): IConge {
    return {
      ...restConge,
      dateDebut: restConge.dateDebut ? dayjs(restConge.dateDebut) : undefined,
      dateRetour: restConge.dateRetour ? dayjs(restConge.dateRetour) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class CongeService extends CongesService {
  protected readonly http = inject(HttpClient);

  create(conge: NewConge): Observable<IConge> {
    const copy = this.convertValueFromClient(conge);
    return this.http.post<RestConge>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(conge: IConge): Observable<IConge> {
    const copy = this.convertValueFromClient(conge);
    return this.http
      .put<RestConge>(`${this.resourceUrl}/${encodeURIComponent(this.getCongeIdentifier(conge))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(conge: PartialUpdateConge): Observable<IConge> {
    const copy = this.convertValueFromClient(conge);
    return this.http
      .patch<RestConge>(`${this.resourceUrl}/${encodeURIComponent(this.getCongeIdentifier(conge))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IConge> {
    return this.http.get<RestConge>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IConge[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConge[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getCongeIdentifier(conge: Pick<IConge, 'id'>): number {
    return conge.id;
  }

  compareConge(o1: Pick<IConge, 'id'> | null, o2: Pick<IConge, 'id'> | null): boolean {
    return o1 && o2 ? this.getCongeIdentifier(o1) === this.getCongeIdentifier(o2) : o1 === o2;
  }

  addCongeToCollectionIfMissing<Type extends Pick<IConge, 'id'>>(
    congeCollection: Type[],
    ...congesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const conges: Type[] = congesToCheck.filter(isPresent);
    if (conges.length > 0) {
      const congeCollectionIdentifiers = congeCollection.map(congeItem => this.getCongeIdentifier(congeItem));
      const congesToAdd = conges.filter(congeItem => {
        const congeIdentifier = this.getCongeIdentifier(congeItem);
        if (congeCollectionIdentifiers.includes(congeIdentifier)) {
          return false;
        }
        congeCollectionIdentifiers.push(congeIdentifier);
        return true;
      });
      return [...congesToAdd, ...congeCollection];
    }
    return congeCollection;
  }

  protected convertValueFromClient<T extends IConge | NewConge | PartialUpdateConge>(conge: T): RestOf<T> {
    return {
      ...conge,
      dateDebut: conge.dateDebut?.format(DATE_FORMAT) ?? null,
      dateRetour: conge.dateRetour?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestConge): IConge {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestConge[]): IConge[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
