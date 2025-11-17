import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../../../core/services/resource.service';
import {BibliotecaService} from '../../../../core/services/biblioteca.service';
import {AuthService} from '../../../../core/services/auth.service';
import {Resource} from '../../../../core/models/resource.model';
import {BibliotecaResponse} from '../../../../core/models/biblioteca.model';
import {HttpErrorResponse} from '@angular/common/http';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-resource-detail',
  imports: [
    DatePipe
  ],
  templateUrl: './resource-detail.component.html',
  styleUrl: './resource-detail.component.css',
})
export class ResourceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private resourceService = inject(ResourceService);
  private bibliotecaService = inject(BibliotecaService);
  private authService = inject(AuthService);

  recurso = signal<Resource | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  guardando = signal(false);
  guardado = signal(false);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  private idBiblioteca: number | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idRecurso = idParam ? Number(idParam) : NaN;

    if (!idRecurso) {
      this.error.set('Recurso no encontrado.');
      this.loading.set(false);
      return;
    }

    // Cargar siempre el recurso (vista pública)
    this.cargarRecurso(idRecurso);

    // Si está autenticado, cargamos la biblioteca para poder guardar
    if (this.isAuthenticated()) {
      this.cargarBibliotecaUsuario();
    }
  }

  private cargarRecurso(idRecurso: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.resourceService.getResourceById(idRecurso).subscribe({
      next: (recurso) => {
        this.recurso.set(recurso);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo cargar el recurso.');
        this.loading.set(false);
      }
    });
  }

  private cargarBibliotecaUsuario(): void {
    this.bibliotecaService.obtenerBibliotecaUsuario().subscribe({
      next: (biblioteca: BibliotecaResponse) => {
        this.idBiblioteca = biblioteca.id_biblioteca;
      },
      error: (err) => {
        console.error(err);
        // Si falla, solo deshabilitamos guardar
        this.idBiblioteca = null;
      }
    });
  }

  guardarEnBiblioteca(): void {
    const recurso = this.recurso();
    if (!recurso || !this.idBiblioteca || this.guardando() || this.guardado()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.bibliotecaService
      .guardarRecursoEnBiblioteca(this.idBiblioteca, recurso.id_recurso)
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.guardado.set(true);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.guardando.set(false);
          this.error.set('No se pudo guardar el recurso en tu biblioteca.');
        }
      });
  }

  // Helpers para la plantilla
  esTexto(): boolean {
    return this.recurso()?.formato === 'TEXTO';
  }

  esEnlace(): boolean {
    return this.recurso()?.formato === 'ENLACE';
  }

  esArchivo(): boolean {
    return this.recurso()?.formato === 'ARCHIVO';
  }
}
