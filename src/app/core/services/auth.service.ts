// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthRequest, RegisterRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { UsuarioService } from './usuario.service'; // 
import { Observable, tap, lastValueFrom } from 'rxjs'; // 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService); 

  private apiUrl = `${environment.apiUrl}/auth`;

  // Estado de autenticación compartido
  private _authState = signal<AuthResponse | null>(null);
  authState = this._authState.asReadonly();

  private cachedUserId: number | null = null;

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
  return this._authState()?.university ?? null;
}


setUserName(name: string): void {
  const current = this._authState();
  if (!current) return;

  const updated: AuthResponse = {
    ...current,
    name
  };

  this._authState.set(updated);
  localStorage.setItem('recolectaedu_auth', JSON.stringify(updated));
}

setUserUniversity(university: string | null): void {
  const current = this._authState();
  if (!current) return;

  const updated: AuthResponse = {
    ...current,
    university: university ?? null
  };

  this._authState.set(updated);
  localStorage.setItem('recolectaedu_auth', JSON.stringify(updated));
}



  logout(): void {
    this._authState.set(null);
    this.cachedUserId = null;
    localStorage.removeItem('recolectaedu_auth');
    this.router.navigate(['/auth/login']);
  }

  /**
   *  MODIFICADO: Obtiene el userId real desde /usuarios/me
   * Cachea el resultado para evitar múltiples llamadas HTTP
   */
  async getUserId(): Promise<number | null> {
    // Si no hay sesión, retornar null
    if (!this.isAuthenticated()) {
      console.warn('⚠️ No hay sesión activa');
      return null;
    }

    // Si ya tenemos el userId en cache, retornarlo
    if (this.cachedUserId !== null) {
      console.log(`✅ getUserId() desde cache: ${this.cachedUserId}`);
      return this.cachedUserId;
    }

    // Si no está en cache, obtenerlo del backend
    try {
      console.log('🔄 Obteniendo userId desde /usuarios/me...');
      const profile = await lastValueFrom(this.usuarioService.getCurrentProfile());
      
      if (profile?.id_usuario) {
        this.cachedUserId = profile.id_usuario;
        console.log(`✅ getUserId() obtenido: ${this.cachedUserId}`);
        return this.cachedUserId;
      }
      
      console.error('❌ El perfil no tiene id_usuario');
      return null;
    } catch (error) {
      console.error('❌ Error al obtener userId:', error);
      return null;
    }
  }
}