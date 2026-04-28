import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import TemplateModelResolve from './route/template-model-routing-resolve.service';

const templateModelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/template-model').then(m => m.TemplateModel),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/template-model-detail').then(m => m.TemplateModelDetail),
    resolve: {
      templateModel: TemplateModelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/template-model-update').then(m => m.TemplateModelUpdate),
    resolve: {
      templateModel: TemplateModelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/template-model-update').then(m => m.TemplateModelUpdate),
    resolve: {
      templateModel: TemplateModelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default templateModelRoute;
