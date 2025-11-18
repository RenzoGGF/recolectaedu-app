// src/app/features/recursos/recursos.routes.ts

import { Routes } from '@angular/router';
import {ResourceDetailComponent} from './pages/resource-detail/resource-detail.component';
import {authGuard} from '../../core/guards/auth.guard';

export const RECURSOS_ROUTES: Routes = [
  {
    path: 'publicar',
    loadComponent: () =>
      import('./pages/publicar-recurso/publicar-recurso.component')
        .then(m => m.PublicarRecursoComponent),
    // canActivate: [authGuard] // Descomentar cuando el AuthService esté listo
  },
  {
    path: 'mis-aportes',
    loadComponent: () =>
      import('./pages/historial-aportes/historial-aportes.component')
        .then(m => m.HistorialAportesComponent),
    canActivate: [authGuard] // Descomentar cuando el AuthService esté listo
  },
  {
    path: ':id',
    component: ResourceDetailComponent
  }
];
