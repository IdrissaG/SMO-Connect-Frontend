import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ITemplateModel, NewTemplateModel } from '../template-model.model';

export type PartialUpdateTemplateModel = Partial<ITemplateModel> & Pick<ITemplateModel, 'id'>;

@Injectable()
export class TemplateModelsService {
  readonly templateModelsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly templateModelsResource = httpResource<ITemplateModel[]>(() => {
    const params = this.templateModelsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of templateModel that have been fetched. It is updated when the templateModelsResource emits a new value.
   * In case of error while fetching the templateModels, the signal is set to an empty array.
   */
  readonly templateModels = computed(() => (this.templateModelsResource.hasValue() ? this.templateModelsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/template-models');
}

@Injectable({ providedIn: 'root' })
export class TemplateModelService extends TemplateModelsService {
  protected readonly http = inject(HttpClient);

  create(templateModel: NewTemplateModel): Observable<ITemplateModel> {
    return this.http.post<ITemplateModel>(this.resourceUrl, templateModel);
  }

  update(templateModel: ITemplateModel): Observable<ITemplateModel> {
    return this.http.put<ITemplateModel>(
      `${this.resourceUrl}/${encodeURIComponent(this.getTemplateModelIdentifier(templateModel))}`,
      templateModel,
    );
  }

  partialUpdate(templateModel: PartialUpdateTemplateModel): Observable<ITemplateModel> {
    return this.http.patch<ITemplateModel>(
      `${this.resourceUrl}/${encodeURIComponent(this.getTemplateModelIdentifier(templateModel))}`,
      templateModel,
    );
  }

  find(id: number): Observable<ITemplateModel> {
    return this.http.get<ITemplateModel>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ITemplateModel[]>> {
    const options = createRequestOption(req);
    return this.http.get<ITemplateModel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getTemplateModelIdentifier(templateModel: Pick<ITemplateModel, 'id'>): number {
    return templateModel.id;
  }

  compareTemplateModel(o1: Pick<ITemplateModel, 'id'> | null, o2: Pick<ITemplateModel, 'id'> | null): boolean {
    return o1 && o2 ? this.getTemplateModelIdentifier(o1) === this.getTemplateModelIdentifier(o2) : o1 === o2;
  }

  addTemplateModelToCollectionIfMissing<Type extends Pick<ITemplateModel, 'id'>>(
    templateModelCollection: Type[],
    ...templateModelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const templateModels: Type[] = templateModelsToCheck.filter(isPresent);
    if (templateModels.length > 0) {
      const templateModelCollectionIdentifiers = templateModelCollection.map(templateModelItem =>
        this.getTemplateModelIdentifier(templateModelItem),
      );
      const templateModelsToAdd = templateModels.filter(templateModelItem => {
        const templateModelIdentifier = this.getTemplateModelIdentifier(templateModelItem);
        if (templateModelCollectionIdentifiers.includes(templateModelIdentifier)) {
          return false;
        }
        templateModelCollectionIdentifiers.push(templateModelIdentifier);
        return true;
      });
      return [...templateModelsToAdd, ...templateModelCollection];
    }
    return templateModelCollection;
  }
}
