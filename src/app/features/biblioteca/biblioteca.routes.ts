import { Routes } from '@angular/router';

export const BIBLIOTECA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-recursos/lista-recursos.component').then(
        (m) => m.ListaRecursosComponent
      ),
  },
];
