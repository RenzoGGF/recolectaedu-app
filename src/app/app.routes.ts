import {Routes} from '@angular/router';
import {LandingLayoutComponent} from './shared/layouts/landing-layout';
import {AuthLayoutComponent} from './shared/layouts/auth.layout';
import {SearchLayoutComponent} from './shared/layouts/search.layout';
import {authGuard} from './core/guards/auth.guard';

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
  },

  {
    path: 'profile',
    component: SearchLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/user/user.routes').then(m => m.USER_ROUTES)
  },

  {
    path: 'search',
    component: SearchLayoutComponent,
    loadChildren: () =>
      import('./features/search/search.routes').then(m => m.SEARCH_ROUTES)
  },
  {
    path: 'biblioteca',
    component: LandingLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/biblioteca/biblioteca.routes').then(m => m.BIBLIOTECA_ROUTES)
  },
  {
    path: 'instituciones',
    component: SearchLayoutComponent,
    loadChildren: () =>
      import('./features/institution/institution.routes')
        .then(m => m.INSTITUTION_ROUTES)
  },

  {
    path: 'cursos',
    component: SearchLayoutComponent,
    loadChildren: () =>
      import('./features/course/course.routes').then(m => m.COURSE_ROUTES)
  },

  {
    path: 'recursos',
    component: SearchLayoutComponent,
    loadChildren: () =>
      import('./features/recursos/recursos.routes').then(m => m.RECURSOS_ROUTES)
  },
  {
    path: 'foro',
    component: SearchLayoutComponent,
    loadChildren: () =>
      import('./features/forum/forum.routes').then(m => m.FORUM_ROUTES)
  }

];
