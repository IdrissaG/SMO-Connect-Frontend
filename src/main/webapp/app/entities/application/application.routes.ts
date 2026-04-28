import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import ApplicationResolve from './route/application-routing-resolve.service';

const applicationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/application').then(m => m.Application),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/application-detail').then(m => m.ApplicationDetail),
    resolve: {
      application: ApplicationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/application-update').then(m => m.ApplicationUpdate),
    resolve: {
      application: ApplicationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/application-update').then(m => m.ApplicationUpdate),
    resolve: {
      application: ApplicationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default applicationRoute;
