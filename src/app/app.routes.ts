import { Routes } from '@angular/router';
import { LandingLayoutComponent } from './shared/layouts/landing-layout';
import { AuthLayoutComponent } from './shared/layouts/auth.layout';


export const routes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    loadChildren: () =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  },
{
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  }

];
