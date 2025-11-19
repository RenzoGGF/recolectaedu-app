import {ChangeDetectionStrategy, Component, inject, input, OnInit, signal} from '@angular/core';

import {Resource, ResourceType} from '../../../../core/models/resource.model';
import {ResourceService} from '../../../../core/services/resource.service';
import {catchError, of, tap} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-recent-resources',
  imports: [CommonModule, RouterLink],
  templateUrl: './recent-resources.html',
  styleUrl: './recent-resources.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentResources implements OnInit {
  courseId = input.required<number>();

  resources = signal<Resource[]>([]);
  loadingMessage = signal('Cargando recursos recientes...');
  isLoading = signal<boolean>(false);

  private resourceService = inject(ResourceService);

  ngOnInit(): void {
    this.loadRecentResources();
  }

  filterByType(tipo: ResourceType): Resource[] {
    return this.resources().filter(r => r.tipo === tipo);
  }

  private loadRecentResources(): void {
    this.isLoading.set(true);
    this.loadingMessage.set('Cargando recursos recientes...');
    this.resources.set([]);

    this.resourceService
      .getRecientesPorCurso(this.courseId())
      .pipe(
        tap((data: Resource[]) => {
          this.resources.set(data);
          if (data.length === 0) {
            this.loadingMessage.set('Este curso aún no tiene recursos.');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('Error al cargar recursos recientes:', err);
          this.loadingMessage.set('Error al cargar los recursos.');
          return of([]);
        })
      )
      .subscribe(() => {
        this.isLoading.set(false);
      });
  }
}
