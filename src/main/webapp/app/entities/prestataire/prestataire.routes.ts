import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import PrestataireResolve from './route/prestataire-routing-resolve.service';

const prestataireRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/prestataire').then(m => m.Prestataire),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/prestataire-detail').then(m => m.PrestataireDetail),
    resolve: {
      prestataire: PrestataireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/prestataire-update').then(m => m.PrestataireUpdate),
    resolve: {
      prestataire: PrestataireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/prestataire-update').then(m => m.PrestataireUpdate),
    resolve: {
      prestataire: PrestataireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default prestataireRoute;
