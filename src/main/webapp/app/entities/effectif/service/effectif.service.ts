import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IEffectif, NewEffectif } from '../effectif.model';

export type PartialUpdateEffectif = Partial<IEffectif> & Pick<IEffectif, 'id'>;

type RestOf<T extends IEffectif | NewEffectif> = Omit<
  T,
  | 'dateRemontee'
  | 'dateDemarrageFormation'
  | 'dateEntreeProd'
  | 'dateSortie'
  | 'dateReintegration'
  | 'dateEnvoyeTidjiCreation'
  | 'dateEnvoyeTidjiReactivation'
  | 'dateEnvoyeTidjiModification'
> & {
  dateRemontee?: string | null;
  dateDemarrageFormation?: string | null;
  dateEntreeProd?: string | null;
  dateSortie?: string | null;
  dateReintegration?: string | null;
  dateEnvoyeTidjiCreation?: string | null;
  dateEnvoyeTidjiReactivation?: string | null;
  dateEnvoyeTidjiModification?: string | null;
};

export type RestEffectif = RestOf<IEffectif>;

export type NewRestEffectif = RestOf<NewEffectif>;

export type PartialUpdateRestEffectif = RestOf<PartialUpdateEffectif>;

@Injectable()
export class EffectifsService {
  readonly effectifsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly effectifsResource = httpResource<RestEffectif[]>(() => {
    const params = this.effectifsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of effectif that have been fetched. It is updated when the effectifsResource emits a new value.
   * In case of error while fetching the effectifs, the signal is set to an empty array.
   */
  readonly effectifs = computed(() =>
    (this.effectifsResource.hasValue() ? this.effectifsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/effectifs');

  protected convertValueFromServer(restEffectif: RestEffectif): IEffectif {
    return {
      ...restEffectif,
      dateRemontee: restEffectif.dateRemontee ? dayjs(restEffectif.dateRemontee) : undefined,
      dateDemarrageFormation: restEffectif.dateDemarrageFormation ? dayjs(restEffectif.dateDemarrageFormation) : undefined,
      dateEntreeProd: restEffectif.dateEntreeProd ? dayjs(restEffectif.dateEntreeProd) : undefined,
      dateSortie: restEffectif.dateSortie ? dayjs(restEffectif.dateSortie) : undefined,
      dateReintegration: restEffectif.dateReintegration ? dayjs(restEffectif.dateReintegration) : undefined,
      dateEnvoyeTidjiCreation: restEffectif.dateEnvoyeTidjiCreation ? dayjs(restEffectif.dateEnvoyeTidjiCreation) : undefined,
      dateEnvoyeTidjiReactivation: restEffectif.dateEnvoyeTidjiReactivation ? dayjs(restEffectif.dateEnvoyeTidjiReactivation) : undefined,
      dateEnvoyeTidjiModification: restEffectif.dateEnvoyeTidjiModification ? dayjs(restEffectif.dateEnvoyeTidjiModification) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class EffectifService extends EffectifsService {
  protected readonly http = inject(HttpClient);

  create(effectif: NewEffectif): Observable<IEffectif> {
    const copy = this.convertValueFromClient(effectif);
    return this.http.post<RestEffectif>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(effectif: IEffectif): Observable<IEffectif> {
    const copy = this.convertValueFromClient(effectif);
    return this.http
      .put<RestEffectif>(`${this.resourceUrl}/${encodeURIComponent(this.getEffectifIdentifier(effectif))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(effectif: PartialUpdateEffectif): Observable<IEffectif> {
    const copy = this.convertValueFromClient(effectif);
    return this.http
      .patch<RestEffectif>(`${this.resourceUrl}/${encodeURIComponent(this.getEffectifIdentifier(effectif))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IEffectif> {
    return this.http
      .get<RestEffectif>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IEffectif[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEffectif[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getEffectifIdentifier(effectif: Pick<IEffectif, 'id'>): number {
    return effectif.id;
  }

  compareEffectif(o1: Pick<IEffectif, 'id'> | null, o2: Pick<IEffectif, 'id'> | null): boolean {
    return o1 && o2 ? this.getEffectifIdentifier(o1) === this.getEffectifIdentifier(o2) : o1 === o2;
  }

  addEffectifToCollectionIfMissing<Type extends Pick<IEffectif, 'id'>>(
    effectifCollection: Type[],
    ...effectifsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const effectifs: Type[] = effectifsToCheck.filter(isPresent);
    if (effectifs.length > 0) {
      const effectifCollectionIdentifiers = effectifCollection.map(effectifItem => this.getEffectifIdentifier(effectifItem));
      const effectifsToAdd = effectifs.filter(effectifItem => {
        const effectifIdentifier = this.getEffectifIdentifier(effectifItem);
        if (effectifCollectionIdentifiers.includes(effectifIdentifier)) {
          return false;
        }
        effectifCollectionIdentifiers.push(effectifIdentifier);
        return true;
      });
      return [...effectifsToAdd, ...effectifCollection];
    }
    return effectifCollection;
  }

  protected convertValueFromClient<T extends IEffectif | NewEffectif | PartialUpdateEffectif>(effectif: T): RestOf<T> {
    return {
      ...effectif,
      dateRemontee: effectif.dateRemontee?.format(DATE_FORMAT) ?? null,
      dateDemarrageFormation: effectif.dateDemarrageFormation?.format(DATE_FORMAT) ?? null,
      dateEntreeProd: effectif.dateEntreeProd?.format(DATE_FORMAT) ?? null,
      dateSortie: effectif.dateSortie?.format(DATE_FORMAT) ?? null,
      dateReintegration: effectif.dateReintegration?.format(DATE_FORMAT) ?? null,
      dateEnvoyeTidjiCreation: effectif.dateEnvoyeTidjiCreation?.toJSON() ?? null,
      dateEnvoyeTidjiReactivation: effectif.dateEnvoyeTidjiReactivation?.toJSON() ?? null,
      dateEnvoyeTidjiModification: effectif.dateEnvoyeTidjiModification?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestEffectif): IEffectif {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestEffectif[]): IEffectif[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
