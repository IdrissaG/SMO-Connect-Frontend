import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IResetPassword, NewResetPassword } from '../reset-password.model';

export type PartialUpdateResetPassword = Partial<IResetPassword> & Pick<IResetPassword, 'id'>;

type RestOf<T extends IResetPassword | NewResetPassword> = Omit<T, 'dateEnvoi' | 'dateCloture'> & {
  dateEnvoi?: string | null;
  dateCloture?: string | null;
};

export type RestResetPassword = RestOf<IResetPassword>;

export type NewRestResetPassword = RestOf<NewResetPassword>;

export type PartialUpdateRestResetPassword = RestOf<PartialUpdateResetPassword>;

@Injectable()
export class ResetPasswordsService {
  readonly resetPasswordsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly resetPasswordsResource = httpResource<RestResetPassword[]>(() => {
    const params = this.resetPasswordsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of resetPassword that have been fetched. It is updated when the resetPasswordsResource emits a new value.
   * In case of error while fetching the resetPasswords, the signal is set to an empty array.
   */
  readonly resetPasswords = computed(() =>
    (this.resetPasswordsResource.hasValue() ? this.resetPasswordsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/reset-passwords');

  protected convertValueFromServer(restResetPassword: RestResetPassword): IResetPassword {
    return {
      ...restResetPassword,
      dateEnvoi: restResetPassword.dateEnvoi ? dayjs(restResetPassword.dateEnvoi) : undefined,
      dateCloture: restResetPassword.dateCloture ? dayjs(restResetPassword.dateCloture) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class ResetPasswordService extends ResetPasswordsService {
  protected readonly http = inject(HttpClient);

  create(resetPassword: NewResetPassword): Observable<IResetPassword> {
    const copy = this.convertValueFromClient(resetPassword);
    return this.http.post<RestResetPassword>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(resetPassword: IResetPassword): Observable<IResetPassword> {
    const copy = this.convertValueFromClient(resetPassword);
    return this.http
      .put<RestResetPassword>(`${this.resourceUrl}/${encodeURIComponent(this.getResetPasswordIdentifier(resetPassword))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(resetPassword: PartialUpdateResetPassword): Observable<IResetPassword> {
    const copy = this.convertValueFromClient(resetPassword);
    return this.http
      .patch<RestResetPassword>(`${this.resourceUrl}/${encodeURIComponent(this.getResetPasswordIdentifier(resetPassword))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IResetPassword> {
    return this.http
      .get<RestResetPassword>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IResetPassword[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestResetPassword[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getResetPasswordIdentifier(resetPassword: Pick<IResetPassword, 'id'>): number {
    return resetPassword.id;
  }

  compareResetPassword(o1: Pick<IResetPassword, 'id'> | null, o2: Pick<IResetPassword, 'id'> | null): boolean {
    return o1 && o2 ? this.getResetPasswordIdentifier(o1) === this.getResetPasswordIdentifier(o2) : o1 === o2;
  }

  addResetPasswordToCollectionIfMissing<Type extends Pick<IResetPassword, 'id'>>(
    resetPasswordCollection: Type[],
    ...resetPasswordsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resetPasswords: Type[] = resetPasswordsToCheck.filter(isPresent);
    if (resetPasswords.length > 0) {
      const resetPasswordCollectionIdentifiers = resetPasswordCollection.map(resetPasswordItem =>
        this.getResetPasswordIdentifier(resetPasswordItem),
      );
      const resetPasswordsToAdd = resetPasswords.filter(resetPasswordItem => {
        const resetPasswordIdentifier = this.getResetPasswordIdentifier(resetPasswordItem);
        if (resetPasswordCollectionIdentifiers.includes(resetPasswordIdentifier)) {
          return false;
        }
        resetPasswordCollectionIdentifiers.push(resetPasswordIdentifier);
        return true;
      });
      return [...resetPasswordsToAdd, ...resetPasswordCollection];
    }
    return resetPasswordCollection;
  }

  protected convertValueFromClient<T extends IResetPassword | NewResetPassword | PartialUpdateResetPassword>(resetPassword: T): RestOf<T> {
    return {
      ...resetPassword,
      dateEnvoi: resetPassword.dateEnvoi?.toJSON() ?? null,
      dateCloture: resetPassword.dateCloture?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestResetPassword): IResetPassword {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestResetPassword[]): IResetPassword[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
