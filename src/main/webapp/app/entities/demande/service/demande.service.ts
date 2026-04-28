import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IDemande, NewDemande } from '../demande.model';

export type PartialUpdateDemande = Partial<IDemande> & Pick<IDemande, 'id'>;

type RestOf<T extends IDemande | NewDemande> = Omit<T, 'dateCreation' | 'dateCloture'> & {
  dateCreation?: string | null;
  dateCloture?: string | null;
};

export type RestDemande = RestOf<IDemande>;

export type NewRestDemande = RestOf<NewDemande>;

export type PartialUpdateRestDemande = RestOf<PartialUpdateDemande>;

@Injectable()
export class DemandesService {
  readonly demandesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly demandesResource = httpResource<RestDemande[]>(() => {
    const params = this.demandesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of demande that have been fetched. It is updated when the demandesResource emits a new value.
   * In case of error while fetching the demandes, the signal is set to an empty array.
   */
  readonly demandes = computed(() =>
    (this.demandesResource.hasValue() ? this.demandesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/demandes');

  protected convertValueFromServer(restDemande: RestDemande): IDemande {
    return {
      ...restDemande,
      dateCreation: restDemande.dateCreation ? dayjs(restDemande.dateCreation) : undefined,
      dateCloture: restDemande.dateCloture ? dayjs(restDemande.dateCloture) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class DemandeService extends DemandesService {
  protected readonly http = inject(HttpClient);

  create(demande: NewDemande): Observable<IDemande> {
    const copy = this.convertValueFromClient(demande);
    return this.http.post<RestDemande>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(demande: IDemande): Observable<IDemande> {
    const copy = this.convertValueFromClient(demande);
    return this.http
      .put<RestDemande>(`${this.resourceUrl}/${encodeURIComponent(this.getDemandeIdentifier(demande))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(demande: PartialUpdateDemande): Observable<IDemande> {
    const copy = this.convertValueFromClient(demande);
    return this.http
      .patch<RestDemande>(`${this.resourceUrl}/${encodeURIComponent(this.getDemandeIdentifier(demande))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IDemande> {
    return this.http
      .get<RestDemande>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IDemande[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDemande[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getDemandeIdentifier(demande: Pick<IDemande, 'id'>): number {
    return demande.id;
  }

  compareDemande(o1: Pick<IDemande, 'id'> | null, o2: Pick<IDemande, 'id'> | null): boolean {
    return o1 && o2 ? this.getDemandeIdentifier(o1) === this.getDemandeIdentifier(o2) : o1 === o2;
  }

  addDemandeToCollectionIfMissing<Type extends Pick<IDemande, 'id'>>(
    demandeCollection: Type[],
    ...demandesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const demandes: Type[] = demandesToCheck.filter(isPresent);
    if (demandes.length > 0) {
      const demandeCollectionIdentifiers = demandeCollection.map(demandeItem => this.getDemandeIdentifier(demandeItem));
      const demandesToAdd = demandes.filter(demandeItem => {
        const demandeIdentifier = this.getDemandeIdentifier(demandeItem);
        if (demandeCollectionIdentifiers.includes(demandeIdentifier)) {
          return false;
        }
        demandeCollectionIdentifiers.push(demandeIdentifier);
        return true;
      });
      return [...demandesToAdd, ...demandeCollection];
    }
    return demandeCollection;
  }

  protected convertValueFromClient<T extends IDemande | NewDemande | PartialUpdateDemande>(demande: T): RestOf<T> {
    return {
      ...demande,
      dateCreation: demande.dateCreation?.toJSON() ?? null,
      dateCloture: demande.dateCloture?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestDemande): IDemande {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestDemande[]): IDemande[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
