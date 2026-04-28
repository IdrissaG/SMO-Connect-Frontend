import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'smoConnectFrontendApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'prestataire',
    data: { pageTitle: 'smoConnectFrontendApp.prestataire.home.title' },
    loadChildren: () => import('./prestataire/prestataire.routes'),
  },
  {
    path: 'plateau',
    data: { pageTitle: 'smoConnectFrontendApp.plateau.home.title' },
    loadChildren: () => import('./plateau/plateau.routes'),
  },
  {
    path: 'profile',
    data: { pageTitle: 'smoConnectFrontendApp.profile.home.title' },
    loadChildren: () => import('./profile/profile.routes'),
  },
  {
    path: 'effectif',
    data: { pageTitle: 'smoConnectFrontendApp.effectif.home.title' },
    loadChildren: () => import('./effectif/effectif.routes'),
  },
  {
    path: 'depart',
    data: { pageTitle: 'smoConnectFrontendApp.depart.home.title' },
    loadChildren: () => import('./depart/depart.routes'),
  },
  {
    path: 'conge',
    data: { pageTitle: 'smoConnectFrontendApp.conge.home.title' },
    loadChildren: () => import('./conge/conge.routes'),
  },
  {
    path: 'application',
    data: { pageTitle: 'smoConnectFrontendApp.application.home.title' },
    loadChildren: () => import('./application/application.routes'),
  },
  {
    path: 'demande',
    data: { pageTitle: 'smoConnectFrontendApp.demande.home.title' },
    loadChildren: () => import('./demande/demande.routes'),
  },
  {
    path: 'blacklist',
    data: { pageTitle: 'smoConnectFrontendApp.blacklist.home.title' },
    loadChildren: () => import('./blacklist/blacklist.routes'),
  },
  {
    path: 'reset-password',
    data: { pageTitle: 'smoConnectFrontendApp.resetPassword.home.title' },
    loadChildren: () => import('./reset-password/reset-password.routes'),
  },
  {
    path: 'template-model',
    data: { pageTitle: 'smoConnectFrontendApp.templateModel.home.title' },
    loadChildren: () => import('./template-model/template-model.routes'),
  },
  {
    path: 'upload-log',
    data: { pageTitle: 'smoConnectFrontendApp.uploadLog.home.title' },
    loadChildren: () => import('./upload-log/upload-log.routes'),
  },
  {
    path: 'email-traite',
    data: { pageTitle: 'smoConnectFrontendApp.emailTraite.home.title' },
    loadChildren: () => import('./email-traite/email-traite.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
