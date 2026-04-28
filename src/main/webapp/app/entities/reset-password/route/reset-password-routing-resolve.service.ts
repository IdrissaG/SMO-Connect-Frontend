import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IResetPassword } from '../reset-password.model';
import { ResetPasswordService } from '../service/reset-password.service';

const resetPasswordResolve = (route: ActivatedRouteSnapshot): Observable<null | IResetPassword> => {
  const id = route.params.id;
  if (id) {
    const router = inject(Router);
    const service = inject(ResetPasswordService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default resetPasswordResolve;
