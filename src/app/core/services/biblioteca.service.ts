import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, Observable} from 'rxjs';
import {BibliotecaRecursoResponse, BibliotecaResponse} from '../models/biblioteca.model';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  obtenerBibliotecaUsuario(): Observable<BibliotecaResponse> {
    return this.http.get<BibliotecaResponse>(`${this.apiUrl}/usuarios/biblioteca`);
  }

  listarRecursos(idBiblioteca: number): Observable<BibliotecaRecursoResponse[]> {
    return this.http.get<BibliotecaRecursoResponse[]>(
      `${this.apiUrl}/bibliotecas/${idBiblioteca}/recursos`
    );
  }

  guardarRecursoEnBiblioteca(idBiblioteca: number, idRecurso: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/bibliotecas/${idBiblioteca}/recursos`,
      { id_recurso: idRecurso }
    );
  }

  verificarRecursoGuardado(idBiblioteca: number, idRecurso: number): Observable<boolean> {
    const url = `${this.apiUrl}/bibliotecas/${idBiblioteca}/recursos/${idRecurso}/verificar`;

    return this.http.get<{ guardado: boolean }>(url).pipe(
      map(response => response.guardado)
    );
  }
}
