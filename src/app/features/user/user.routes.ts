import { Routes } from '@angular/router';
import { UserProfilePageComponent } from './pages/user-profile.component';
import { UserProfileEditPageComponent } from './pages/user-profile-edit.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserProfilePageComponent
  },
  {
    path: 'edit',
    component: UserProfileEditPageComponent
  }
];
