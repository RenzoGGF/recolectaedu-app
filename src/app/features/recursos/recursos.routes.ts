import { Routes } from '@angular/router';
import {ResourceDetailComponent} from './pages/resource-detail/resource-detail.component';

export const RECURSOS_ROUTES: Routes = [
  {
    path: 'publicar',
    loadComponent: () =>
      import('./pages/publicar-recurso/publicar-recurso.component')
        .then(m => m.PublicarRecursoComponent),
    // canActivate: [authGuard] // Descomentar cuando el AuthService esté listo
  },
  {
    path: ':id',
    component: ResourceDetailComponent
  },
];
