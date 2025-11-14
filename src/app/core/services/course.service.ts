import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from '../models/course.model';

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

}
