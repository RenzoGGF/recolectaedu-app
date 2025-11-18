import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Aporte, RespuestaPagina, AportesParams } from '../models/aporte.model';
import { HttpParams } from '@angular/common/http';
import { UsuarioStats } from '../models/usuario-stats.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // Signals para ESTADO COMPARTIDO
  private _items = signal<any[]>([]);
  items = this._items.asReadonly();

  // GET - Obtener todos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => this._items.set(data))
    );
  }

  // GET - Obtener por ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id`);
  }

  // POST - Crear
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap(newItem => {
        this._items.update(current => [...current, newItem]);
      })
    );
  }

  // PUT - Actualizar
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/id`, data).pipe(
      tap(updatedItem => {
        this._items.update(current =>
          current.map(item => item.id === id ? updatedItem : item)
        );
      })
    );
  }

  // DELETE - Eliminar
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/id`).pipe(
      tap(() => {
        this._items.update(current => current.filter(item => item.id !== id));
      })
    );
  }

      /**
   * US-08: Obtener historial de aportes de un usuario
   * GET /api/v1/usuarios/{usuarioId}/aportes
   */
  getAportes(params: AportesParams): Observable<RespuestaPagina<Aporte>> {
    const url = `${this.apiUrl}/${params.usuarioId}/aportes`;
    
    let httpParams = new HttpParams()
      .set('page', (params.page || 0).toString())
      .set('size', (params.size || 10).toString());
    
    if (params.tipo) {
      httpParams = httpParams.set('tipo', params.tipo);
    }
    
    if (params.cursoId) {
      httpParams = httpParams.set('cursoId', params.cursoId.toString());
    }
    
    if (params.sort && params.sort.length === 2) {
      httpParams = httpParams.set('sort', params.sort.join(','));
    }
    
    return this.http.get<RespuestaPagina<Aporte>>(url, { params: httpParams });
  }

    /**
   * US-17: Obtener estadísticas del usuario
   * GET /api/v1/usuarios/{usuarioId}/estadisticas
   */
  getUserStats(usuarioId: number): Observable<UsuarioStats> {
    const url = `${this.apiUrl}/${usuarioId}/estadisticas`;
    return this.http.get<UsuarioStats>(url);
  }

  }
