// CAMBIO 1: Importamos 'RouterLink'
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFolder, faSearch } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, tap } from 'rxjs';

import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-institution-detail',
  standalone: true,
  // CAMBIO 2: Añadimos 'RouterLink' a los imports
  imports: [CommonModule, FaIconComponent, RouterLink],
  template: `
    <div class="institution-container">

      <h1 class="uni-title">{{ universityName() }}</h1>

      <div class="internal-search">
        <input type="text" placeholder="Busca documentos en esta institución">
        <fa-icon [icon]="iconSearch" class="search-icon"></fa-icon>
      </div>

      <div class="content-grid">

        <div class="courses-section">
          <div class="section-header">
            <h2>Cursos [{{ courses().length }}]</h2>
            <div class="sort-dropdown">
              <select>
                <option>Ordenar por</option>
                <option value="POPULARES">Populares</option>
                <option value="RECIENTES">Recientes</option>
              </select>
            </div>
          </div>

          <div class="courses-list">
            @for (course of courses(); track course.id_curso) {
              <a [routerLink]="['/cursos', course.id_curso]" class="course-item">
                <fa-icon [icon]="iconFolder" class="folder-icon"></fa-icon>
                <span>{{ course.nombre }}</span>
              </a>
            } @empty {
              <p>{{ loadingMessage() }}</p>
            }
          </div>
        </div>

        <div class="categories-card">
          <h3>Categorías de contenido</h3>
          <div class="stats-container">
            <div class="stat-row"><strong>Documentos totales</strong><span>90</span></div>
            <div class="stat-row"><span>Apuntes</span><strong>10</strong></div>
            <div class="stat-row"><span>Prácticas</span><strong>10</strong></div>
            <div class="stat-row"><span>Ejercicios</span><strong>2</strong></div>
            <div class="stat-row"><span>Otros</span><strong>1</strong></div>
          </div>
        </div>

      </div>
    </div>
  `,
  // CAMBIO 4: Añadimos estilos para el nuevo <a>
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .uni-title {
      font-size: 1.8rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 20px;
      color: #000;
    }
    .internal-search {
      position: relative;
      max-width: 600px;
      margin: 0 auto 40px auto;
    }
    .internal-search input {
      width: 100%;
      padding: 12px 40px 12px 20px;
      border-radius: 50px;
      border: 1px solid #E7E7EE;
      background-color: #FFFFFF;
      font-size: 0.95rem;
    }
    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #555;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 250px;
      gap: 40px;
      align-items: start;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .section-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
    }
    .sort-dropdown select {
      padding: 5px 10px;
      border-radius: 5px;
      border: 1px solid #AAA;
    }
    .courses-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px 10px;
    }

    /* ¡AQUÍ LOS NUEVOS ESTILOS! */
    .course-item {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
      text-decoration: none; /* Quitamos el subrayado feo del link */
    }
    .folder-icon {
      color: #32CD32;
      font-size: 1.8rem;
      flex-shrink: 0;
    }
    .course-item span {
      font-weight: 600;
      color: #0D8EFF; /* Color de link */
      font-size: 1rem;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: text-decoration 0.2s ease;
    }
    .course-item:hover span {
      text-decoration: underline; /* Subrayado al pasar el mouse */
    }
    /* (Fin de los estilos nuevos) */

    .categories-card {
      background-color: #FFFFFF;
      border-radius: 15px;
      padding: 30px 25px;
      position: sticky;
      top: 130px;
      min-height: 350px;
      display: flex;
      flex-direction: column;
      height: calc(80vh);
    }
    .categories-card h3 {
      font-size: 1rem;
      font-weight: 700;
      text-align: center;
      margin-top: 0;
      margin-bottom: 25px;
      line-height: 1.3;
    }
    .stats-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      flex-grow: 1;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
    }
    .stat-row:last-child {
      border-bottom: none;
    }
    .stat-row strong {
      font-weight: 700;
    }
  `]
})
export class InstitutionDetailComponent implements OnInit {
  iconFolder = faFolder;
  iconSearch = faSearch;

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  universityName = signal('');
  courses = signal<Course[]>([]); // Ahora es de tipo Course[]
  loadingMessage = signal('Cargando cursos populares...');

  ngOnInit() {
    this.route.params.subscribe(params => {
      const uniName = params['universidad'];
      if (uniName) {
        this.universityName.set(uniName);
        this.loadCourses(uniName); // Ya estabas llamando a esto
      } else {
        this.loadingMessage.set('Universidad no especificada.');
      }
    });
  }

  loadCourses(universityName: string) {
    this.loadingMessage.set('Cargando cursos populares...');
    this.courses.set([]);

    this.courseService.getCursosPopulares(universityName).pipe(
      tap((data: Course[]) => {
        this.courses.set(data); // El signal se llena con datos reales
        if (data.length === 0) {
          this.loadingMessage.set('Esta institución no cuenta con cursos populares.');
        }
      }),
      catchError((err) => {
        console.error('Error al cargar cursos:', err);
        this.loadingMessage.set('Error al cargar los cursos. Intente de nuevo.');
        return of([]);
      })
    ).subscribe();
  }
}
