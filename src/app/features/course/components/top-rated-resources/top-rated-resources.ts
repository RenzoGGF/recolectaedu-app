import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {HttpErrorResponse} from '@angular/common/http';
import {RecursoValoradoResponse} from '../../../../core/models/resource.model';
import {ResourceService} from '../../../../core/services/resource.service';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {catchError, of, tap} from "rxjs";
import {CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-top-rated-resources',
  imports: [CommonModule,FaIconComponent, DatePipe],
  templateUrl: './top-rated-resources.html',
  styleUrl: './top-rated-resources.css',
})
export class TopRatedResources implements OnInit {
  courseId = input.required<number>();

  resources = signal<RecursoValoradoResponse[]>([]);
  loadingMessage = signal('Cargando recursos más valorados...');
  iconThumb = faThumbsUp;

  private resourceService = inject(ResourceService);

  ngOnInit(): void {
    this.loadTopRatedResources();
  }

  private loadTopRatedResources(): void {
    this.loadingMessage.set('Cargando recursos más valorados...');
    this.resources.set([]);

    this.resourceService
      .getMasValoradosPorCurso(this.courseId())
      .pipe(
        tap((data: RecursoValoradoResponse[]) => {
          this.resources.set(data);
          if (data.length === 0) {
            this.loadingMessage.set('Este curso aún no tiene recursos valorados.');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('Error al cargar recursos más valorados:', err);
          this.loadingMessage.set('Error al cargar los recursos valorados.');
          return of([]);
        })
      )
      .subscribe();
  }
}
