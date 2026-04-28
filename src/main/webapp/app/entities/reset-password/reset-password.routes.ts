import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import ResetPasswordResolve from './route/reset-password-routing-resolve.service';

const resetPasswordRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/reset-password').then(m => m.ResetPassword),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/reset-password-detail').then(m => m.ResetPasswordDetail),
    resolve: {
      resetPassword: ResetPasswordResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/reset-password-update').then(m => m.ResetPasswordUpdate),
    resolve: {
      resetPassword: ResetPasswordResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/reset-password-update').then(m => m.ResetPasswordUpdate),
    resolve: {
      resetPassword: ResetPasswordResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resetPasswordRoute;
