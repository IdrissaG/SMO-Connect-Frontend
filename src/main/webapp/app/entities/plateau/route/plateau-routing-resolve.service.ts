import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';

const plateauResolve = (route: ActivatedRouteSnapshot): Observable<null | IPlateau> => {
  const id = route.params.id;
  if (id) {
    const router = inject(Router);
    const service = inject(PlateauService);
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

export default plateauResolve;
