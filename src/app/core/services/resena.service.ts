import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {ResenaCreateRequest, ResenaPartialUpdateRequest, ResenaResponse} from '../models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private http = inject(HttpClient);

  private base_url = `${environment.apiUrl}/resenas`;
  private public_url = `${environment.apiUrl}/public/resenas`;

  getResenasPorRecurso(id_recuso: number): Observable<ResenaResponse[]> {
    const url = `${this.public_url}/recurso/${id_recuso}`;
    return this.http.get<ResenaResponse[]>(url);
  }

  createResena(request: ResenaCreateRequest): Observable<ResenaResponse> {
    return this.http.post<ResenaResponse>(this.base_url, request);
  }

  updateResenaPartial(id_resena: number, request: ResenaPartialUpdateRequest): Observable<ResenaResponse> {
    return this.http.patch<ResenaResponse>(`${this.base_url}/${id_resena}`, request);
  }
}
