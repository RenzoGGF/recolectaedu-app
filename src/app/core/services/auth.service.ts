// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthRequest, RegisterRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/auth`;

  // Estado de autenticación compartido
  private _authState = signal<AuthResponse | null>(null);
  authState = this._authState.asReadonly();

  constructor() {
    // Intentar restaurar sesión desde localStorage
    const stored = localStorage.getItem('recolectaedu_auth');
    if (stored) {
      try {
        const parsed: AuthResponse = JSON.parse(stored);
        this._authState.set(parsed);
      } catch {
        localStorage.removeItem('recolectaedu_auth');
      }
    }
  }

  /**
   * Registro de usuario: POST /auth/register
   */
  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap((res) => {
          this._authState.set(res);
          localStorage.setItem('recolectaedu_auth', JSON.stringify(res));
        })
      );
  }

  /**
   * Login: POST /auth/login
   */
  login(payload: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, payload)
      .pipe(
        tap((res) => {
          this._authState.set(res);
          localStorage.setItem('recolectaedu_auth', JSON.stringify(res));
        })
      );
  }

  /**
   * ¿Hay sesión activa?
   */
  isAuthenticated(): boolean {
    return !!this._authState();
  }

  /**
   * ¿Es admin?
   * Por ahora, lo dejamos como en el stub original: siempre false.
   * Más adelante, cuando el backend envíe el rol en el token o en el AuthResponse,
   * aquí podemos decodificar/ver el rol y devolver true/false real.
   */
  isAdmin(): boolean {
    return false;
  }

  /**
   * Token sin el prefijo Bearer
   */
  getToken(): string | null {
    return this._authState()?.token ?? null;
  }

  getUserName(): string | null {
    return this._authState()?.name ?? null;
  }

  getUserUniversity(): string | null {
    const auth = this._authState();
    // Por ahora el backend no manda universidad; dejamos el método listo
    // Si en el futuro AuthResponse incluye `university`, solo se mapea aquí.
    // @ts-ignore
    return auth && auth.university ? auth.university : null;
  }

  logout(): void {
    this._authState.set(null);
    localStorage.removeItem('recolectaedu_auth');
    this.router.navigate(['/auth/login']);
  }

  getUserId(): number | null {
    const authState = this._authState();
    if (!authState) return null;

    // TODO TEMPORAL: Hardcoded mientras el backend no envía el userId
    console.warn('⚠️ TEMPORAL: Usando userId hardcodeado. El backend debe enviar el userId en AuthResponse o token.');

    // Mapeo temporal email → userId
    // ELIMINAR ESTO cuando el backend envíe el userId real
    const emailToIdMap: Record<string, number> = {
      'eduardo.bravo@example.com': 1,
      'test@example.com': 1,
      'email@example.com': 1
      // Agregar más si necesitas probar con otros usuarios
    };

    const email = authState.email;
    const tempUserId = emailToIdMap[email] || 1; // Default a 1

    console.log(`🔍 Email: ${email} → userId temporal: ${tempUserId}`);

    return tempUserId;
  }
}
