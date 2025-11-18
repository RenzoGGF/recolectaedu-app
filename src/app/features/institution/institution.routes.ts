// src/app/features/institution/institution.routes.ts

import { Routes } from '@angular/router';
import { InstitutionDetailComponent } from './pages/institution-detail.component';
import { InstitutionRankingComponent } from './pages/institution-ranking.component';

export const INSTITUTION_ROUTES: Routes = [
  {
    path: ':universidad/ranking', 
    component: InstitutionRankingComponent
  },
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