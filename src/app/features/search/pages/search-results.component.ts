// CAMBIO 1: Importamos todo lo necesario
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Params } from '@angular/router'; // ActivatedRoute para leer la URL
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { Resource, SearchResourceParams } from '../../../core/models/resource.model';
import { ResourceService } from '../../../core/services/resource.service'; // Nuestro servicio
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  template: `
    <main class="results-column">
      <div class="results-header">
        <h1>Todos</h1>
        <select class="order-select">
          <option value="recientes">Ordenar por</option>
          <option value="recientes">Recientes</option>
          <option value="relevantes">Relevantes</option>
        </select>
      </div>

      <div class="results-list">
        @for (resource of resources(); track resource.id_recurso) {
          <div class="resource-card">

            <div class="resource-image">
              <span>[IMG]</span>
            </div>

            <div class="resource-content">
              <h3>{{ resource.titulo }}</h3>
              <span class="course">{{ resource.id_curso }}</span>
              <span class="university">{{ resource.autorNombre }}</span>

              <div class="details">
                <span>{{ resource.descripcion }}</span>
                <span>{{ resource.creado_el | date: 'yyyy/MM/dd' }}</span>
              </div>

              <span class="format">{{ resource.formato }}</span>
            </div>

            <div class="resource-rating">
              <fa-icon [icon]="iconThumb"></fa-icon>
              </div>

          </div>
        } @empty {
          <p>{{ loadingMessage() }}</p>
        }
      </div>
    </main>
  `,
  // (Tus estilos no cambian)
  styles: [`
    .results-column { }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 1px solid #E7E7EE;
    }
    .results-header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #000; 
      margin: 0;
    }
    .order-select {
      padding: 10px 14px;
      border: 1px solid #AAA;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      background-color: #FFFFFF;
      color: #000;
    }
    .results-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .resource-card {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      background-color: #FFFFFF;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .resource-image { width: 110px; height: 110px; flex-shrink: 0; background-color: #E7E7EE; border-radius: 8px; display: grid; place-items: center; font-weight: 600; color: #8A8A8A; }
    .resource-content { flex-grow: 1; }
    .resource-content h3 { font-size: 1.1rem; font-weight: 700; color: #0D8EFF; margin: 0 0 5px 0; }
    .resource-content .course { display: inline-block; font-size: 0.9rem; font-weight: 600; color: #000; background-color: #E5DFFF; padding: 3px 10px; border-radius: 50px; margin-right: 10px; }
    .resource-content .university { font-size: 0.9rem; font-weight: 600; color: #555; }
    .resource-content .details { font-size: 0.9rem; color: #555; margin: 8px 0; }
    .resource-content .details span { margin-right: 15px; }
    .resource-content .format { font-size: 0.9rem; font-weight: 700; color: #8A8A8A; }
    .resource-rating { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 600; white-space: nowrap; color: #32CD32; }
    .resource-rating span { font-size: 0.9rem; color: #555; }
  `]
})
export class SearchResultsComponent implements OnInit {
  iconThumb = faThumbsUp;

  // --- CAMBIO 4: Lógica del componente ---

  // Inyectamos los servicios
  private route = inject(ActivatedRoute);
  private resourceService = inject(ResourceService);

  // Creamos el signal para los recursos, inicializado como vacío
  resources = signal<Resource[]>([]);
  // Signal para el mensaje de "cargando"
  loadingMessage = signal('Cargando recursos...');

  ngOnInit(): void {
    // Nos suscribimos a los cambios en los parámetros de la URL
    this.route.queryParams.subscribe((params: Params) => {
      // 1. Convertimos los Params de la URL a nuestra interfaz
      const searchParams: SearchResourceParams = {
        keyword: params['keyword'],
        cursoId: params['cursoId'] ? +params['cursoId'] : undefined,
        tipo: params['tipo'],
        autor: params['autor'],
        universidad: params['universidad'],
        ordenarPor: params['ordenarPor']
      };

      // 2. (Opcional) Limpiamos los filtros indefinidos (mejor práctica)
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v != null)
      );

      // 3. Llamamos a nuestro método para cargar recursos
      this.loadResources(cleanParams);
    });
  }

  
  loadResources(params: SearchResourceParams): void {
    this.loadingMessage.set('Buscando...'); // Actualiza el mensaje
    this.resources.set([]); // Vacía los resultados anteriores

    this.resourceService.searchResources(params).pipe(
      tap((data: Resource[]) => {
        // Éxito: Actualizamos el signal con los datos
        this.resources.set(data);
        if (data.length === 0) {
          this.loadingMessage.set('No se encontraron recursos que coincidan con tu búsqueda.');
        }
      }),
      catchError((err: HttpErrorResponse) => {
        // Error: Manejamos el error
        console.error('Error al cargar recursos:', err);
        this.loadingMessage.set('Error al cargar recursos. Intenta de nuevo más tarde.');
        return of(null); // Devolvemos un observable nulo para que la app no se rompa
      })
    ).subscribe();
  }
}