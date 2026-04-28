import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import EmailTraiteResolve from './route/email-traite-routing-resolve.service';

const emailTraiteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/email-traite').then(m => m.EmailTraite),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/email-traite-detail').then(m => m.EmailTraiteDetail),
    resolve: {
      emailTraite: EmailTraiteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/email-traite-update').then(m => m.EmailTraiteUpdate),
    resolve: {
      emailTraite: EmailTraiteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/email-traite-update').then(m => m.EmailTraiteUpdate),
    resolve: {
      emailTraite: EmailTraiteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default emailTraiteRoute;
