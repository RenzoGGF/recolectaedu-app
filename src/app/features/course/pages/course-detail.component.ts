import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faFolder, faSearch} from '@fortawesome/free-solid-svg-icons';
import {catchError, of, tap} from 'rxjs';

import {Course} from '../../../core/models/course.model';
import {CourseService} from '../../../core/services/course.service';
import {HttpErrorResponse} from '@angular/common/http';
import {RecentResources} from '../components/recent-resources/recent-resources';
import {TopRatedResources} from '../components/top-rated-resources/top-rated-resources';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FaIconComponent, RecentResources, TopRatedResources],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  iconFolder = faFolder;
  iconSearch = faSearch;

  courseName = signal('Cargando...');
  totalDocs = signal(0);
  activeSort = signal<'recientes' | 'valoracion'>('recientes');
  loadingMessage = signal('Cargando recursos...');
  courseId = signal<number | null>(null);

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (!id) {
        this.loadingMessage.set('Error: No se encontró ID del curso.');
        return;
      }

      this.courseId.set(id);
      this.loadCourseInfo(id);
    });
  }

  setSort(sortType: 'recientes' | 'valoracion'): void {
    this.activeSort.set(sortType);
  }

  private loadCourseInfo(id: number): void {
    this.courseService
      .getCursoById(id)
      .pipe(
        tap((data: Course) => {
          this.courseName.set(data.nombre);
          this.totalDocs.set(data.totalRecursos);
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('Error al cargar info del curso:', err);
          this.courseName.set('Error al cargar curso');
          return of(null);
        })
      )
      .subscribe();
  }
}
