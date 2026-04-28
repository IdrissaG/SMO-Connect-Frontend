import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IPlateau, NewPlateau } from '../plateau.model';

export type PartialUpdatePlateau = Partial<IPlateau> & Pick<IPlateau, 'id'>;

@Injectable()
export class PlateausService {
  readonly plateausParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly plateausResource = httpResource<IPlateau[]>(() => {
    const params = this.plateausParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of plateau that have been fetched. It is updated when the plateausResource emits a new value.
   * In case of error while fetching the plateaus, the signal is set to an empty array.
   */
  readonly plateaus = computed(() => (this.plateausResource.hasValue() ? this.plateausResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/plateaus');
}

@Injectable({ providedIn: 'root' })
export class PlateauService extends PlateausService {
  protected readonly http = inject(HttpClient);

  create(plateau: NewPlateau): Observable<IPlateau> {
    return this.http.post<IPlateau>(this.resourceUrl, plateau);
  }

  update(plateau: IPlateau): Observable<IPlateau> {
    return this.http.put<IPlateau>(`${this.resourceUrl}/${encodeURIComponent(this.getPlateauIdentifier(plateau))}`, plateau);
  }

  partialUpdate(plateau: PartialUpdatePlateau): Observable<IPlateau> {
    return this.http.patch<IPlateau>(`${this.resourceUrl}/${encodeURIComponent(this.getPlateauIdentifier(plateau))}`, plateau);
  }

  find(id: number): Observable<IPlateau> {
    return this.http.get<IPlateau>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IPlateau[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPlateau[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPlateauIdentifier(plateau: Pick<IPlateau, 'id'>): number {
    return plateau.id;
  }

  comparePlateau(o1: Pick<IPlateau, 'id'> | null, o2: Pick<IPlateau, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlateauIdentifier(o1) === this.getPlateauIdentifier(o2) : o1 === o2;
  }

  addPlateauToCollectionIfMissing<Type extends Pick<IPlateau, 'id'>>(
    plateauCollection: Type[],
    ...plateausToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plateaus: Type[] = plateausToCheck.filter(isPresent);
    if (plateaus.length > 0) {
      const plateauCollectionIdentifiers = plateauCollection.map(plateauItem => this.getPlateauIdentifier(plateauItem));
      const plateausToAdd = plateaus.filter(plateauItem => {
        const plateauIdentifier = this.getPlateauIdentifier(plateauItem);
        if (plateauCollectionIdentifiers.includes(plateauIdentifier)) {
          return false;
        }
        plateauCollectionIdentifiers.push(plateauIdentifier);
        return true;
      });
      return [...plateausToAdd, ...plateauCollection];
    }
    return plateauCollection;
  }
}
