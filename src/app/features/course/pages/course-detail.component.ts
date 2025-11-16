import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faFolder, faSearch, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {catchError, of, tap} from 'rxjs';

import {Course} from '../../../core/models/course.model';
import {Resource, ResourceType} from '../../../core/models/resource.model';
import {CourseService} from '../../../core/services/course.service';
import {ResourceService} from '../../../core/services/resource.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  iconFolder = faFolder;
  iconSearch = faSearch;
  iconThumb = faThumbsUp;
  courseName = signal('Cargando...');
  totalDocs = signal(0);
  activeSort = signal<'recientes' | 'valoracion'>('recientes');
  allResources = signal<Resource[]>([]);
  loadingMessage = signal('Cargando recursos...');
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private resourceService = inject(ResourceService);
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
      catchError((err: HttpErrorResponse) => {
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
      catchError((err: HttpErrorResponse) => {
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
