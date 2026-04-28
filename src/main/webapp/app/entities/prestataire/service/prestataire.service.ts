import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IPrestataire, NewPrestataire } from '../prestataire.model';

export type PartialUpdatePrestataire = Partial<IPrestataire> & Pick<IPrestataire, 'id'>;

@Injectable()
export class PrestatairesService {
  readonly prestatairesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly prestatairesResource = httpResource<IPrestataire[]>(() => {
    const params = this.prestatairesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of prestataire that have been fetched. It is updated when the prestatairesResource emits a new value.
   * In case of error while fetching the prestataires, the signal is set to an empty array.
   */
  readonly prestataires = computed(() => (this.prestatairesResource.hasValue() ? this.prestatairesResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/prestataires');
}

@Injectable({ providedIn: 'root' })
export class PrestataireService extends PrestatairesService {
  protected readonly http = inject(HttpClient);

  create(prestataire: NewPrestataire): Observable<IPrestataire> {
    return this.http.post<IPrestataire>(this.resourceUrl, prestataire);
  }

  update(prestataire: IPrestataire): Observable<IPrestataire> {
    return this.http.put<IPrestataire>(
      `${this.resourceUrl}/${encodeURIComponent(this.getPrestataireIdentifier(prestataire))}`,
      prestataire,
    );
  }

  partialUpdate(prestataire: PartialUpdatePrestataire): Observable<IPrestataire> {
    return this.http.patch<IPrestataire>(
      `${this.resourceUrl}/${encodeURIComponent(this.getPrestataireIdentifier(prestataire))}`,
      prestataire,
    );
  }

  find(id: number): Observable<IPrestataire> {
    return this.http.get<IPrestataire>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IPrestataire[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPrestataire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPrestataireIdentifier(prestataire: Pick<IPrestataire, 'id'>): number {
    return prestataire.id;
  }

  comparePrestataire(o1: Pick<IPrestataire, 'id'> | null, o2: Pick<IPrestataire, 'id'> | null): boolean {
    return o1 && o2 ? this.getPrestataireIdentifier(o1) === this.getPrestataireIdentifier(o2) : o1 === o2;
  }

  addPrestataireToCollectionIfMissing<Type extends Pick<IPrestataire, 'id'>>(
    prestataireCollection: Type[],
    ...prestatairesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const prestataires: Type[] = prestatairesToCheck.filter(isPresent);
    if (prestataires.length > 0) {
      const prestataireCollectionIdentifiers = prestataireCollection.map(prestataireItem => this.getPrestataireIdentifier(prestataireItem));
      const prestatairesToAdd = prestataires.filter(prestataireItem => {
        const prestataireIdentifier = this.getPrestataireIdentifier(prestataireItem);
        if (prestataireCollectionIdentifiers.includes(prestataireIdentifier)) {
          return false;
        }
        prestataireCollectionIdentifiers.push(prestataireIdentifier);
        return true;
      });
      return [...prestatairesToAdd, ...prestataireCollection];
    }
    return prestataireCollection;
  }
}
