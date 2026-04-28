import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import DepartResolve from './route/depart-routing-resolve.service';

const departRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/depart').then(m => m.Depart),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/depart-detail').then(m => m.DepartDetail),
    resolve: {
      depart: DepartResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/depart-update').then(m => m.DepartUpdate),
    resolve: {
      depart: DepartResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/depart-update').then(m => m.DepartUpdate),
    resolve: {
      depart: DepartResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default departRoute;
