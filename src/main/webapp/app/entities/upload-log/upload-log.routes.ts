import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import UploadLogResolve from './route/upload-log-routing-resolve.service';

const uploadLogRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/upload-log').then(m => m.UploadLog),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/upload-log-detail').then(m => m.UploadLogDetail),
    resolve: {
      uploadLog: UploadLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/upload-log-update').then(m => m.UploadLogUpdate),
    resolve: {
      uploadLog: UploadLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/upload-log-update').then(m => m.UploadLogUpdate),
    resolve: {
      uploadLog: UploadLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default uploadLogRoute;
