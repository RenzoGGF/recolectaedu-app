import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}
