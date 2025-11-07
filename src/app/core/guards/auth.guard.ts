import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Tu lógica de validación aquí
  const isAuthenticated = false; // Ejemplo
  
  if (isAuthenticated) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};