import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resource, SearchResourceParams } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private http = inject(HttpClient);


  //BASE PARA PúBLICO!!! (SI TIENEN UN METODO DE RECURSO QUE NO SEA PÚBLICO, HACER OTRO BASE URL O SERVICIO)
  private baseUrl = `${environment.apiUrl}/public`;

  searchResources(searchParams: SearchResourceParams): Observable<Resource[]> {

    const url = `${this.baseUrl}/recursos`;

    let params = new HttpParams();

    if (searchParams.keyword) {
      params = params.set('keyword', searchParams.keyword);
    }
    if (searchParams.cursoId) {
      params = params.set('cursoId', searchParams.cursoId.toString());
    }
    if (searchParams.tipo) {
      params = params.set('tipo', searchParams.tipo);
    }
    if (searchParams.autor) {
      params = params.set('autor', searchParams.autor);
    }
    if (searchParams.universidad) {
      params = params.set('universidad', searchParams.universidad);
    }
    if (searchParams.ordenarPor) {
      params = params.set('ordenarPor', searchParams.ordenarPor);
    }

    return this.http.get<Resource[]>(url, { params });
  }


}
