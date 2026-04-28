import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import PlateauResolve from './route/plateau-routing-resolve.service';

const plateauRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/plateau').then(m => m.Plateau),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/plateau-detail').then(m => m.PlateauDetail),
    resolve: {
      plateau: PlateauResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/plateau-update').then(m => m.PlateauUpdate),
    resolve: {
      plateau: PlateauResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/plateau-update').then(m => m.PlateauUpdate),
    resolve: {
      plateau: PlateauResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default plateauRoute;
