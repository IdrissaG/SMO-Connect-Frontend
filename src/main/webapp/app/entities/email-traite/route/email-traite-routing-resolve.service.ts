import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IEmailTraite } from '../email-traite.model';
import { EmailTraiteService } from '../service/email-traite.service';

const emailTraiteResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmailTraite> => {
  const id = route.params.id;
  if (id) {
    const router = inject(Router);
    const service = inject(EmailTraiteService);
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

export default emailTraiteResolve;
