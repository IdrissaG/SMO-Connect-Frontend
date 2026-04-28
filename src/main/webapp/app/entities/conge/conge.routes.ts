import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CongeResolve from './route/conge-routing-resolve.service';

const congeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/conge').then(m => m.Conge),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/conge-detail').then(m => m.CongeDetail),
    resolve: {
      conge: CongeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/conge-update').then(m => m.CongeUpdate),
    resolve: {
      conge: CongeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/conge-update').then(m => m.CongeUpdate),
    resolve: {
      conge: CongeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default congeRoute;
