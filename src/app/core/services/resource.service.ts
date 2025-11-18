// src/app/core/services/resource.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecursoValoradoResponse, Resource, SearchResourceParams } from '../models/resource.model';
import { RecursoCreateRequest, RecursoArchivoCreateRequest } from '../models/recurso-create.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private http = inject(HttpClient);

  // BASE PARA PÚBLICO!!! (SI TIENEN UN MÉTODO DE RECURSO QUE NO SEA PÚBLICO, HACER OTRO BASE URL O SERVICIO)
  private baseUrl = `${environment.apiUrl}/public`;
  private baseUrlRecursos = `${this.baseUrl}/recursos`;

  // ⭐ BASE URL PARA RECURSOS AUTENTICADOS (sin /public)
  private resourcesUrl = `${environment.apiUrl}/recursos`;

  // ==================== MÉTODOS EXISTENTES (PÚBLICOS) ====================

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

  getRecientesPorCurso(cursoId: number): Observable<Resource[]> {
    const url = `${this.baseUrl}/recursos/curso/${cursoId}/recientes`;
    return this.http.get<Resource[]>(url);
  }

  getMasValoradosPorCurso(cursoId: number): Observable<RecursoValoradoResponse[]> {
    const url = `${this.baseUrl}/recursos/curso/${cursoId}/mas-valorados`;
    return this.http.get<RecursoValoradoResponse[]>(url);
  }

  // ==================== MÉTODOS NUEVOS (AUTENTICADOS) - US-05 ====================

  /**
   * US-05: Crear recurso con JSON (ENLACE o TEXTO)
   * POST /api/v1/recursos
   */
  createResourceJson(data: RecursoCreateRequest): Observable<Resource> {
    return this.http.post<Resource>(this.resourcesUrl, data);
  }

  /**
   * US-05: Crear recurso con ARCHIVO (multipart/form-data)
   * POST /api/v1/recursos
   */
  createResourceFile(archivo: File, metadata: RecursoArchivoCreateRequest): Observable<Resource> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    // El metadata debe ir como JSON string en un Blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json'
    });
    formData.append('metadata', metadataBlob);

    return this.http.post<Resource>(this.resourcesUrl, formData);
  }

  updateResourceFile(id: number, archivo: File, metadata: RecursoArchivoCreateRequest): Observable<Resource> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json'
    });
    formData.append('metadata', metadataBlob);

    // Nota el /archivo al final para coincidir con el Controller sugerido
    return this.http.put<Resource>(`${this.resourcesUrl}/${id}/archivo`, formData);
  }

  /**
   * Validar archivo antes de subirlo
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Validar tamaño (20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB en bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo excede el tamaño máximo permitido de 20 MB.'
      };
    }

    // Validar extensión
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();

    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: 'Extensión de archivo no permitida. Solo se aceptan: PDF, DOC, DOCX.'
      };
    }

    return { valid: true };
  }

  /**
   * Actualizar recurso
   * PUT /api/v1/recursos/{id}
   */
  updateResource(id: number, data: RecursoCreateRequest): Observable<Resource> {
    return this.http.put<Resource>(`${this.resourcesUrl}/${id}`, data);
  }

  /**
   * Eliminar recurso
   * DELETE /api/v1/recursos/{id}
   */
  deleteResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcesUrl}/${id}`);
  }

  /**
   * Obtener recurso por ID
   * GET /api/v1/recursos/{id}
   */
  getResourceById(id: number): Observable<Resource> {
    return this.http.get<Resource>(`${this.baseUrlRecursos}/${id}`);
  }
}
