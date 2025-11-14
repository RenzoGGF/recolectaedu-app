import { Routes } from '@angular/router';
import { InstitutionDetailComponent } from './pages/institution-detail.component';

export const INSTITUTION_ROUTES: Routes = [
  {
    path: ':universidad',
    component: InstitutionDetailComponent
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
