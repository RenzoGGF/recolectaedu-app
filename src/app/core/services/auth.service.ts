import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // --- Métodos "Stub" (Placenta) para evitar errores ---
  // Llenaremos esto con lógica real cuando hagamos el login

  /**
   * Verifica si el usuario está autenticado.
   * Por ahora, diremos que no lo está.
   */
  isAuthenticated(): boolean {
    return false;
  }

  /**
   * Verifica si el usuario es administrador.
   * Por ahora, diremos que no lo es.
   */
  isAdmin(): boolean {
    return false;
  }

  /**
   * Obtiene el token de autenticación.
   * Por ahora, no hay token.
   */
  getToken(): string | null {
    return null;
  }

  /**
   * Cierra la sesión del usuario.
   * Por ahora, no hace nada.
   */
  logout(): void {
    console.log('logout() llamado');
  }
}
