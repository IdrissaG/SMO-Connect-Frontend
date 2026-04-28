import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IDepart, NewDepart } from '../depart.model';

export type PartialUpdateDepart = Partial<IDepart> & Pick<IDepart, 'id'>;

type RestOf<T extends IDepart | NewDepart> = Omit<T, 'dateDepart' | 'desistementFormation' | 'dateRemontee'> & {
  dateDepart?: string | null;
  desistementFormation?: string | null;
  dateRemontee?: string | null;
};

export type RestDepart = RestOf<IDepart>;

export type NewRestDepart = RestOf<NewDepart>;

export type PartialUpdateRestDepart = RestOf<PartialUpdateDepart>;

@Injectable()
export class DepartsService {
  readonly departsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly departsResource = httpResource<RestDepart[]>(() => {
    const params = this.departsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of depart that have been fetched. It is updated when the departsResource emits a new value.
   * In case of error while fetching the departs, the signal is set to an empty array.
   */
  readonly departs = computed(() =>
    (this.departsResource.hasValue() ? this.departsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/departs');

  protected convertValueFromServer(restDepart: RestDepart): IDepart {
    return {
      ...restDepart,
      dateDepart: restDepart.dateDepart ? dayjs(restDepart.dateDepart) : undefined,
      desistementFormation: restDepart.desistementFormation ? dayjs(restDepart.desistementFormation) : undefined,
      dateRemontee: restDepart.dateRemontee ? dayjs(restDepart.dateRemontee) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class DepartService extends DepartsService {
  protected readonly http = inject(HttpClient);

  create(depart: NewDepart): Observable<IDepart> {
    const copy = this.convertValueFromClient(depart);
    return this.http.post<RestDepart>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(depart: IDepart): Observable<IDepart> {
    const copy = this.convertValueFromClient(depart);
    return this.http
      .put<RestDepart>(`${this.resourceUrl}/${encodeURIComponent(this.getDepartIdentifier(depart))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(depart: PartialUpdateDepart): Observable<IDepart> {
    const copy = this.convertValueFromClient(depart);
    return this.http
      .patch<RestDepart>(`${this.resourceUrl}/${encodeURIComponent(this.getDepartIdentifier(depart))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IDepart> {
    return this.http.get<RestDepart>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IDepart[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDepart[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getDepartIdentifier(depart: Pick<IDepart, 'id'>): number {
    return depart.id;
  }

  compareDepart(o1: Pick<IDepart, 'id'> | null, o2: Pick<IDepart, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepartIdentifier(o1) === this.getDepartIdentifier(o2) : o1 === o2;
  }

  addDepartToCollectionIfMissing<Type extends Pick<IDepart, 'id'>>(
    departCollection: Type[],
    ...departsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const departs: Type[] = departsToCheck.filter(isPresent);
    if (departs.length > 0) {
      const departCollectionIdentifiers = departCollection.map(departItem => this.getDepartIdentifier(departItem));
      const departsToAdd = departs.filter(departItem => {
        const departIdentifier = this.getDepartIdentifier(departItem);
        if (departCollectionIdentifiers.includes(departIdentifier)) {
          return false;
        }
        departCollectionIdentifiers.push(departIdentifier);
        return true;
      });
      return [...departsToAdd, ...departCollection];
    }
    return departCollection;
  }

  protected convertValueFromClient<T extends IDepart | NewDepart | PartialUpdateDepart>(depart: T): RestOf<T> {
    return {
      ...depart,
      dateDepart: depart.dateDepart?.format(DATE_FORMAT) ?? null,
      desistementFormation: depart.desistementFormation?.toJSON() ?? null,
      dateRemontee: depart.dateRemontee?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestDepart): IDepart {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestDepart[]): IDepart[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
