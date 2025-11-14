import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFolder, faSearch, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, tap } from 'rxjs';

import { Course } from '../../../core/models/course.model';
import { Resource, ResourceType } from '../../../core/models/resource.model';
import { CourseService } from '../../../core/services/course.service';
import { ResourceService } from '../../../core/services/resource.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FaIconComponent, RouterLink],
  template: `
    <div class="course-header-block">
      <div class="course-header">
        <div class="header-left">
          <fa-icon [icon]="iconFolder" class="header-folder-icon"></fa-icon>
          <div class="header-info">
            <h1>{{ courseName() }}</h1>
            <span>Documentos totales [{{ totalDocs() }}]</span>
          </div>
        </div>
        <div class="header-right">
          <div class="internal-search">
            <input type="text" placeholder="Busca documentos en este curso">
            <fa-icon [icon]="iconSearch" class="search-icon"></fa-icon>
          </div>
        </div>
      </div>

      <div class="filter-bar">
        <div class="sort-links">
          <button
            type="button"
            class="sort-link"
            [class.active-sort]="activeSort() === 'recientes'"
            (click)="setSort('recientes')">
            Recientes
          </button>
          <button
            type="button"
            class="sort-link"
            [class.active-sort]="activeSort() === 'valoracion'"
            (click)="setSort('valoracion')">
            Valoración
          </button>
        </div>

        <div class="filter-group">
          <select class="type-filter">
            <option value="">Tipo archivo</option>
            <option value="ARCHIVO">ARCHIVO</option>
            <option value="ENLACE">ENLACE</option>
            <option value="TEXTO">TEXTO</option>
          </select>
        </div>
      </div>
    </div>

    <div class="resource-group">
      <h2>Apuntes</h2>
      <div class="results-list">
        @for (resource of filterResources('Apuntes'); track resource.id_recurso) {
          <div class="resource-card">
            <div class="resource-image"><span>[IMG]</span></div>
            <div class="resource-content">
              <h3 class="resource-title">{{ resource.titulo }}</h3>
              <span class="creation-date">{{ resource.creado_el | date:'yyyy/MM/dd' }}</span>
              <span class="format-type">{{ resource.formato }}</span>
            </div>
            </div>
        } @empty {
          <p>{{ loadingMessage() }}</p>
        }
      </div>
    </div>

    <div class="resource-group">
      <h2>Prácticas</h2>
      <div class="results-list">
        @for (resource of filterResources('Practicas'); track resource.id_recurso) {
          <div class="resource-card">
            <div class="resource-image"><span>[IMG]</span></div>
            <div class="resource-content">
              <h3 class="resource-title">{{ resource.titulo }}</h3>
              <span class="creation-date">{{ resource.creado_el | date:'yyyy/MM/dd' }}</span>
              <span class="format-type">{{ resource.formato }}</span>
            </div>
          </div>
        }
      </div>
    </div>
    <div class="resource-group">
      <h2>Ejercicios</h2>
      <div class="results-list">
        @for (resource of filterResources('Ejercicios'); track resource.id_recurso) {
          <div class="resource-card">
            <div class="resource-image"><span>[IMG]</span></div>
            <div class="resource-content">
              <h3 class="resource-title">{{ resource.titulo }}</h3>
              <span class="creation-date">{{ resource.creado_el | date:'yyyy/MM/dd' }}</span>
              <span class="format-type">{{ resource.formato }}</span>
            </div>
          </div>
        }
      </div>
    </div>
    <div class="resource-group">
      <h2>Otros</h2>
      <div class="results-list">
          @for (resource of filterResources('Otros'); track resource.id_recurso) {
            <div class="resource-card">
              <div class="resource-image"><span>[IMG]</span></div>
              <div class="resource-content">
                <h3 class="resource-title">{{ resource.titulo }}</h3>
                <span class="creation-date">{{ resource.creado_el | date:'yyyy/MM/dd' }}</span>
                <span class="format-type">{{ resource.formato }}</span>
              </div>
            </div>
          }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: -40px -20px 0 -20px;
    }
    .course-header-block {
      background-color: #E5DFFF;
      padding: 30px;
      margin-bottom: 30px;
      margin-top: -40px;
    }
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .header-folder-icon {
      font-size: 2.5rem;
      color: #32CD32;
    }
    .header-info h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0;
      color: #000;
    }
    .header-info span {
      font-size: 1rem;
      font-weight: 600;
      color: #555;
    }
    .header-right {
      display: flex;
    }
    .internal-search {
      position: relative;
      width: 350px;
      padding-right: 50px;
    }
    .internal-search input {
      width: 100%;
      padding: 12px 40px 12px 20px;
      border-radius: 50px;
      border: 1px solid #E7E7EE;
      background-color: #FFFFFF;
    }
    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #555;
    }
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sort-links {
      display: flex;
      gap: 25px;
    }
    .sort-link {
      background: none;
      border: none;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #555;
      cursor: pointer;
      padding: 0;
    }
    .sort-link:hover {
      color: #0D8EFF;
    }
    .sort-link.active-sort {
      color: #32CD32;
      font-weight: 700;
    }
    .filter-group select {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #AAA;
      background: #FFF;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }
    .resource-group {
      margin: 30px 30px 30px 30px;
    }
    .resource-group h2 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 15px;
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
    .resource-image { width: 110px; height: 110px; flex-shrink: 0; background-color: #E5DFFF; border-radius: 8px; display: grid; place-items: center; font-weight: 600; color: #8A8A8A; font-size: 0.8rem; }
    .resource-content { flex-grow: 1; display: flex; flex-direction: column; gap: 4px; }
    .resource-title { font-size: 1.1rem; font-weight: 700; color: #0D8EFF; margin: 0 0 5px 0; }
    .creation-date { font-size: 0.85rem; color: #555; }
    .format-type { font-size: 0.9rem; font-weight: 700; color: #555; margin-top: 8px; }
    .resource-rating { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 600; white-space: nowrap; color: #32CD32; }
    .resource-rating span { font-size: 0.9rem; color: #555; }
  `]
})
export class CourseDetailComponent implements OnInit {
  iconFolder = faFolder;
  iconSearch = faSearch;
  iconThumb = faThumbsUp;

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private resourceService = inject(ResourceService);

  courseName = signal('Cargando...');
  totalDocs = signal(0);
  activeSort = signal<'recientes' | 'valoracion'>('recientes');

  allResources = signal<Resource[]>([]);
  loadingMessage = signal('Cargando recursos...');

  private courseId: number | null = null;

  filterResources(tipo: ResourceType): Resource[] {
    return this.allResources().filter(r => r.tipo === tipo);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = +params['id'];
      if (courseId) {
        this.courseId = courseId;
        this.loadCourseInfo(courseId);
        this.loadCourseResources(courseId);
      } else {
        this.loadingMessage.set('Error: No se encontró ID del curso.');
      }
    });
  }


  loadCourseInfo(id: number) {
    this.courseService.getCursoById(id).pipe(
      tap((data: Course) => {
        this.courseName.set(data.nombre);
        this.totalDocs.set(data.totalRecursos);
      }),
      catchError((err) => {
        console.error('Error al cargar info del curso:', err);
        this.courseName.set('Error al cargar curso');
        return of(null);
      })
    ).subscribe();
  }


  loadCourseResources(id: number) {
    this.loadingMessage.set('Cargando recursos recientes...');
    this.allResources.set([]);

    this.resourceService.getRecientesPorCurso(id).pipe(
      tap((data: Resource[]) => {
        this.allResources.set(data);
        if (data.length === 0) {
          this.loadingMessage.set('Este curso aún no tiene recursos.');
        }
      }),
      catchError((err) => {
        console.error('Error al cargar recursos del curso:', err);
        this.loadingMessage.set('Error al cargar los recursos.');
        return of([]);
      })
    ).subscribe();
  }

  setSort(sortType: 'recientes' | 'valoracion'): void {
    this.activeSort.set(sortType);

    if (!this.courseId) return;

    if (sortType === 'recientes') {
      this.loadCourseResources(this.courseId);
    } else {
      console.log('Llamando a la API de Valoración (no implementado)...');
      this.loadingMessage.set('El filtro por valoración no está implementado.');
      this.allResources.set([]);
    }
  }
}
