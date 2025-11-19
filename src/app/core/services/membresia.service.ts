import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Membresia, Plan } from '../models/membresia.model';

export interface MembresiaRequest {
  plan: Plan;       // MONTHLY o ANNUAL
  autoRenew: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // GET /usuarios/{idUsuario}/membresias
  getByUsuario(idUsuario: number): Observable<Membresia[]> {
    return this.http.get<Membresia[]>(`${this.apiUrl}/${idUsuario}/membresias`);
  }

  // POST /usuarios/{idUsuario}/membresias
  create(idUsuario: number, plan: Plan, autoRenew = true): Observable<Membresia> {
    const body: MembresiaRequest = { plan, autoRenew };
    return this.http.post<Membresia>(
      `${this.apiUrl}/${idUsuario}/membresias`,
      body
    );
  }

  // PUT /usuarios/{idUsuario}/membresias/cancelar   (cancelar la activa)
  cancelActive(idUsuario: number): Observable<Membresia> {
    return this.http.put<Membresia>(
      `${this.apiUrl}/${idUsuario}/membresias/cancelar`,
      {}
    );
  }

  // PUT /usuarios/{idUsuario}/membresias/{idMembresia}/cancelar
  cancelById(idUsuario: number, idMembresia: number): Observable<Membresia> {
    return this.http.put<Membresia>(
      `${this.apiUrl}/${idUsuario}/membresias/${idMembresia}/cancelar`,
      {}
    );
  }
}
