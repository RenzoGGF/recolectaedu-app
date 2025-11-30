import { Routes } from '@angular/router';
import { InstitutionDetailComponent } from './pages/institution-detail.component';
import { InstitutionRankingComponent } from './pages/institution-ranking.component';
import { InstitutionListComponent } from './pages/institution-list.component';

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
    component: InstitutionListComponent
  }
];
