import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 1. Importamos el Sidebar que acabamos de crear
import { UserSidebar } from '../../../shared/components/user-sidebar';

// 2. Importamos el modelo de Recurso
import { Resource } from '../../../core/models/resource.model';

// 3. Importamos el ícono de "like"
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink, UserSidebar, FaIconComponent],
  template: `
    <div class="page-container">

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
                <span class="course">{{ resource.cursoNombre }}</span>
                <span class="university">{{ resource.universidadNombre }}</span>

                <div class="details">
                  <span>{{ resource.paginas }} páginas</span>
                  <span>{{ resource.anio }}</span>
                </div>

                <span class="format">{{ resource.formato }}</span>
              </div>

              <div class="resource-rating">
                <fa-icon [icon]="iconThumb"></fa-icon>
                <strong>{{ resource.rating }}%</strong>
                <span>({{ resource.votos }})</span>
              </div>

            </div>
          } @empty {
            <p>No se encontraron recursos.</p>
          }
        </div>
      </main>

      <aside class="sidebar-column">
        <app-user-sidebar />
      </aside>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      /* CAMBIO 2: El fondo vuelve a ser GRIS CLARO */
      background-color: #f8f7fB;
      padding: 40px 20px;
      font-family: 'Poppins', sans-serif;
      min-height: 100vh;
    }

    /* CAMBIO 3: Volvemos a usar Grid para el layout */
    .page-container {
      display: grid;
      /* Columna 1 (flexible) | Columna 2 (fija de 300px) */
      grid-template-columns: 1fr 300px;
      gap: 30px;
      max-width: 1300px;
      margin: 0 auto;
      /* Alinear los elementos al inicio (arriba) */
      align-items: start;
    }

    .results-column {
      /* Columna izquierda (main) */
    }

    .sidebar-column {
      /* Columna derecha (aside) */
    }

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
      /* CAMBIO 4: El título vuelve a ser oscuro */
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

    /* (El resto de estilos de .resource-card no cambia) */
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
    .resource-image {
      width: 110px;
      height: 110px;
      flex-shrink: 0;
      background-color: #E7E7EE;
      border-radius: 8px;
      display: grid;
      place-items: center;
      font-weight: 600;
      color: #8A8A8A;
    }
    .resource-content {
      flex-grow: 1;
    }
    .resource-content h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0D8EFF;
      margin: 0 0 5px 0;
    }
    .resource-content .course {
      display: inline-block;
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      background-color: #E5DFFF;
      padding: 3px 10px;
      border-radius: 50px;
      margin-right: 10px;
    }
    .resource-content .university {
      font-size: 0.9rem;
      font-weight: 600;
      color: #555;
    }
    .resource-content .details {
      font-size: 0.9rem;
      color: #555;
      margin: 8px 0;
    }
    .resource-content .details span {
      margin-right: 15px;
    }
    .resource-content .format {
      font-size: 0.9rem;
      font-weight: 700;
      color: #8A8A8A;
    }
    .resource-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
      color: #32CD32;
    }
    .resource-rating span {
      font-size: 0.9rem;
      color: #555;
    }
  `]
})
export class SearchResultsComponent {
  iconThumb = faThumbsUp;
  resources = signal<any[]>([
    { id_recurso: 1, titulo: 'Clase 1 semana 1', cursoNombre: 'Calculo 1', universidadNombre: 'Universidad de Lima', paginas: 3, anio: '2020/2021', formato: 'PDF', rating: 97.5, votos: 40 },
    { id_recurso: 2, titulo: 'Clase 1 semana 2', cursoNombre: 'Calculo 1', universidadNombre: 'Universidad de Lima', paginas: 3, anio: '2020/2021', formato: 'PDF', rating: 3, votos: 100 },
    { id_recurso: 3, titulo: 'Clase 1 semana 3', cursoNombre: 'Calculo 1', universidadNombre: 'Universidad de Lima', paginas: 5, anio: '2020/2021', formato: 'PDF', rating: 90, votos: 13 }
  ]);
  constructor() {}
}
