import { Routes } from '@angular/router';
import { CourseDetailComponent } from './pages/course-detail.component';
export const COURSE_ROUTES: Routes = [
  {
    path: ':id',
    component: CourseDetailComponent
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
