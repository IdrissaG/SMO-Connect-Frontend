import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IApplication, NewApplication } from '../application.model';

export type PartialUpdateApplication = Partial<IApplication> & Pick<IApplication, 'id'>;

@Injectable()
export class ApplicationsService {
  readonly applicationsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly applicationsResource = httpResource<IApplication[]>(() => {
    const params = this.applicationsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of application that have been fetched. It is updated when the applicationsResource emits a new value.
   * In case of error while fetching the applications, the signal is set to an empty array.
   */
  readonly applications = computed(() => (this.applicationsResource.hasValue() ? this.applicationsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/applications');
}

@Injectable({ providedIn: 'root' })
export class ApplicationService extends ApplicationsService {
  protected readonly http = inject(HttpClient);

  create(application: NewApplication): Observable<IApplication> {
    return this.http.post<IApplication>(this.resourceUrl, application);
  }

  update(application: IApplication): Observable<IApplication> {
    return this.http.put<IApplication>(
      `${this.resourceUrl}/${encodeURIComponent(this.getApplicationIdentifier(application))}`,
      application,
    );
  }

  partialUpdate(application: PartialUpdateApplication): Observable<IApplication> {
    return this.http.patch<IApplication>(
      `${this.resourceUrl}/${encodeURIComponent(this.getApplicationIdentifier(application))}`,
      application,
    );
  }

  find(id: number): Observable<IApplication> {
    return this.http.get<IApplication>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IApplication[]>> {
    const options = createRequestOption(req);
    return this.http.get<IApplication[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getApplicationIdentifier(application: Pick<IApplication, 'id'>): number {
    return application.id;
  }

  compareApplication(o1: Pick<IApplication, 'id'> | null, o2: Pick<IApplication, 'id'> | null): boolean {
    return o1 && o2 ? this.getApplicationIdentifier(o1) === this.getApplicationIdentifier(o2) : o1 === o2;
  }

  addApplicationToCollectionIfMissing<Type extends Pick<IApplication, 'id'>>(
    applicationCollection: Type[],
    ...applicationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const applications: Type[] = applicationsToCheck.filter(isPresent);
    if (applications.length > 0) {
      const applicationCollectionIdentifiers = applicationCollection.map(applicationItem => this.getApplicationIdentifier(applicationItem));
      const applicationsToAdd = applications.filter(applicationItem => {
        const applicationIdentifier = this.getApplicationIdentifier(applicationItem);
        if (applicationCollectionIdentifiers.includes(applicationIdentifier)) {
          return false;
        }
        applicationCollectionIdentifiers.push(applicationIdentifier);
        return true;
      });
      return [...applicationsToAdd, ...applicationCollection];
    }
    return applicationCollection;
  }
}
