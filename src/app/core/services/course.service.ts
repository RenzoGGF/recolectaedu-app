import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from '../models/course.model';
import { UniversityRanking } from '../models/university.model';
import { RankingResponse } from '../models/ranking.model';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private http = inject(HttpClient);

  // BASE PARA PÚBLICO!! CREAR OTRA SI SU METODO NO ES PÚBLICO
  private baseUrl = `${environment.apiUrl}/public`;

  getCursosPopulares(institucion: string): Observable<Course[]> {

    const url = `${this.baseUrl}/cursos/populares`;

    let params = new HttpParams().set('institucion', institucion);

    return this.http.get<Course[]>(url, { params });
  }
  getCursoById(id: number): Observable<Course> {

    const url = `${this.baseUrl}/cursos/${id}`;

    return this.http.get<Course>(url);
  }

  getRankingUniversidades(): Observable<UniversityRanking[]> {
    const url = `${this.baseUrl}/universidades/ranking-recursos`;
    return this.http.get<UniversityRanking[]>(url);
  }

    /**
   * US-18: Obtener ranking de cursos por aportes
   * GET /public/cursos/ranking-aportes
   */
  getRankingCursos(params?: {
    universidad?: string;
    carrera?: string;
    page?: number;
    size?: number;
  }): Observable<RankingResponse> {
    let httpParams = new HttpParams();
    
    if (params?.universidad) {
      httpParams = httpParams.set('universidad', params.universidad);
    }
    if (params?.carrera) {
      httpParams = httpParams.set('carrera', params.carrera);
    }
    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    
    return this.http.get<RankingResponse>(
      `${environment.apiUrl}/public/cursos/ranking-aportes`,
      { params: httpParams }
    );
  }


}
