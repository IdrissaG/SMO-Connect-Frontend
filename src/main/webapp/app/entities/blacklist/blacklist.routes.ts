import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import BlacklistResolve from './route/blacklist-routing-resolve.service';

const blacklistRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/blacklist').then(m => m.Blacklist),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/blacklist-detail').then(m => m.BlacklistDetail),
    resolve: {
      blacklist: BlacklistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/blacklist-update').then(m => m.BlacklistUpdate),
    resolve: {
      blacklist: BlacklistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/blacklist-update').then(m => m.BlacklistUpdate),
    resolve: {
      blacklist: BlacklistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default blacklistRoute;
