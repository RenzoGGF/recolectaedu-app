import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Tu lógica de validación aquí
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/auth', 'login']);
};
