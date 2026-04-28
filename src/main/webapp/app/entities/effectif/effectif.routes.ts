import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import EffectifResolve from './route/effectif-routing-resolve.service';

const effectifRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/effectif').then(m => m.Effectif),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/effectif-detail').then(m => m.EffectifDetail),
    resolve: {
      effectif: EffectifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/effectif-update').then(m => m.EffectifUpdate),
    resolve: {
      effectif: EffectifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/effectif-update').then(m => m.EffectifUpdate),
    resolve: {
      effectif: EffectifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default effectifRoute;
