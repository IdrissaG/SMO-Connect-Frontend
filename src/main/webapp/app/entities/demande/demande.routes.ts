import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import DemandeResolve from './route/demande-routing-resolve.service';

const demandeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/demande').then(m => m.Demande),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/demande-detail').then(m => m.DemandeDetail),
    resolve: {
      demande: DemandeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/demande-update').then(m => m.DemandeUpdate),
    resolve: {
      demande: DemandeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/demande-update').then(m => m.DemandeUpdate),
    resolve: {
      demande: DemandeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default demandeRoute;
