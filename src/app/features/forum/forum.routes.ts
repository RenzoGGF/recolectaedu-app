import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';


import { ForumListComponent } from './pages/forum-list.component';
import { ForumTopicComponent } from './pages/forum-topic.component';
export const FORUM_ROUTES: Routes = [
  {
    path: '',
    component: ForumListComponent
  },
  {
    path: ':id',
    component: ForumTopicComponent,
    canActivate: [authGuard]
  }

];
