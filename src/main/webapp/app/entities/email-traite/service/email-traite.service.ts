import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IEmailTraite, NewEmailTraite } from '../email-traite.model';

export type PartialUpdateEmailTraite = Partial<IEmailTraite> & Pick<IEmailTraite, 'id'>;

type RestOf<T extends IEmailTraite | NewEmailTraite> = Omit<T, 'dateReception'> & {
  dateReception?: string | null;
};

export type RestEmailTraite = RestOf<IEmailTraite>;

export type NewRestEmailTraite = RestOf<NewEmailTraite>;

export type PartialUpdateRestEmailTraite = RestOf<PartialUpdateEmailTraite>;

@Injectable()
export class EmailTraitesService {
  readonly emailTraitesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly emailTraitesResource = httpResource<RestEmailTraite[]>(() => {
    const params = this.emailTraitesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of emailTraite that have been fetched. It is updated when the emailTraitesResource emits a new value.
   * In case of error while fetching the emailTraites, the signal is set to an empty array.
   */
  readonly emailTraites = computed(() =>
    (this.emailTraitesResource.hasValue() ? this.emailTraitesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/email-traites');

  protected convertValueFromServer(restEmailTraite: RestEmailTraite): IEmailTraite {
    return {
      ...restEmailTraite,
      dateReception: restEmailTraite.dateReception ? dayjs(restEmailTraite.dateReception) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class EmailTraiteService extends EmailTraitesService {
  protected readonly http = inject(HttpClient);

  create(emailTraite: NewEmailTraite): Observable<IEmailTraite> {
    const copy = this.convertValueFromClient(emailTraite);
    return this.http.post<RestEmailTraite>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(emailTraite: IEmailTraite): Observable<IEmailTraite> {
    const copy = this.convertValueFromClient(emailTraite);
    return this.http
      .put<RestEmailTraite>(`${this.resourceUrl}/${encodeURIComponent(this.getEmailTraiteIdentifier(emailTraite))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(emailTraite: PartialUpdateEmailTraite): Observable<IEmailTraite> {
    const copy = this.convertValueFromClient(emailTraite);
    return this.http
      .patch<RestEmailTraite>(`${this.resourceUrl}/${encodeURIComponent(this.getEmailTraiteIdentifier(emailTraite))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IEmailTraite> {
    return this.http
      .get<RestEmailTraite>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IEmailTraite[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEmailTraite[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getEmailTraiteIdentifier(emailTraite: Pick<IEmailTraite, 'id'>): number {
    return emailTraite.id;
  }

  compareEmailTraite(o1: Pick<IEmailTraite, 'id'> | null, o2: Pick<IEmailTraite, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmailTraiteIdentifier(o1) === this.getEmailTraiteIdentifier(o2) : o1 === o2;
  }

  addEmailTraiteToCollectionIfMissing<Type extends Pick<IEmailTraite, 'id'>>(
    emailTraiteCollection: Type[],
    ...emailTraitesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emailTraites: Type[] = emailTraitesToCheck.filter(isPresent);
    if (emailTraites.length > 0) {
      const emailTraiteCollectionIdentifiers = emailTraiteCollection.map(emailTraiteItem => this.getEmailTraiteIdentifier(emailTraiteItem));
      const emailTraitesToAdd = emailTraites.filter(emailTraiteItem => {
        const emailTraiteIdentifier = this.getEmailTraiteIdentifier(emailTraiteItem);
        if (emailTraiteCollectionIdentifiers.includes(emailTraiteIdentifier)) {
          return false;
        }
        emailTraiteCollectionIdentifiers.push(emailTraiteIdentifier);
        return true;
      });
      return [...emailTraitesToAdd, ...emailTraiteCollection];
    }
    return emailTraiteCollection;
  }

  protected convertValueFromClient<T extends IEmailTraite | NewEmailTraite | PartialUpdateEmailTraite>(emailTraite: T): RestOf<T> {
    return {
      ...emailTraite,
      dateReception: emailTraite.dateReception?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestEmailTraite): IEmailTraite {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestEmailTraite[]): IEmailTraite[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
